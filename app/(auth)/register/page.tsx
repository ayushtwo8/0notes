'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { Input, Button } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-gray-500 mt-2">Start your journey with Notes</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-[#E34664] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
