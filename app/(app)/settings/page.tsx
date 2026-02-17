'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { updateProfileSchema, updatePasswordSchema, UpdateProfileInput, UpdatePasswordInput } from '@/lib/validations/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input, Button, Card } from '@/components/ui';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session, profileForm]);

  const onUpdateProfile = async (data: UpdateProfileInput) => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await update();
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setIsUpdating(false);
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordInput) => {
    setIsUpdating(true);
    setMessage(null);
    try {
      const response = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        passwordForm.reset();
        setMessage({ type: 'success', text: 'Password updated successfully' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-[#E34664] border-b-2 border-[#E34664]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-[#E34664] border-b-2 border-[#E34664]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Password
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {activeTab === 'profile' ? (
          <Card>
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <Input
                label="Full Name"
                leftIcon={<User className="w-4 h-4" />}
                error={profileForm.formState.errors.name}
                {...profileForm.register('name')}
              />
              <Input
                label="Email"
                type="email"
                leftIcon={<Mail className="w-4 h-4" />}
                error={profileForm.formState.errors.email}
                {...profileForm.register('email')}
              />
              <div className="pt-4">
                <Button type="submit" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card>
            <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={passwordForm.formState.errors.currentPassword}
                {...passwordForm.register('currentPassword')}
              />
              <Input
                label="New Password"
                type="password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={passwordForm.formState.errors.newPassword}
                {...passwordForm.register('newPassword')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={passwordForm.formState.errors.confirmNewPassword}
                {...passwordForm.register('confirmNewPassword')}
              />
              <div className="pt-4">
                <Button type="submit" isLoading={isUpdating}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
