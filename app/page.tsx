import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Sparkles, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Notes App - Capture Your Ideas',
  description: 'A beautiful, minimal note-taking application for organizing your thoughts and ideas.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E34664] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Notes</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5E6DB] text-[#E34664] text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Beautifully simple note-taking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Capture your ideas
            <br />
            <span className="text-[#E34664]">beautifully</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A minimal, soothing note-taking experience designed to help you focus on what matters most—your ideas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start for free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features that matter</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to capture, organize, and access your notes from anywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#F5E6DB] flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#E34664]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rich Text Editor</h3>
              <p className="text-gray-600">
                Format your notes with headings, lists, code blocks, tables, and more with our powerful editor.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#364737] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organized Folders</h3>
              <p className="text-gray-600">
                Keep your notes organized with nested folders up to 4 levels deep. Drag and drop to reorder.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#EB7822] flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your notes are private and secure. We use industry-standard encryption to protect your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#E34664] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create an account</h3>
              <p className="text-gray-600">
                Sign up for free and get started in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#EB7822] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create your first note</h3>
              <p className="text-gray-600">
                Use our rich text editor to capture your ideas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#364737] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organize & access</h3>
              <p className="text-gray-600">
                Use folders and tags to keep everything organized
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#364737]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start capturing your ideas?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of users who trust Notes for their daily note-taking needs.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E34664] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Notes</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Notes App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
