import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
