import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#364737] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Notes</h1>
          <p className="text-lg text-white/80 mb-8">
            Your personal space for capturing ideas, organizing thoughts, and staying productive.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E34664] flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="text-white/90">Capture ideas instantly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EB7822] flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <span className="text-white/90">Organize with folders & tags</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B9D2D1] flex items-center justify-center">
                <span className="text-[#364737] font-bold">3</span>
              </div>
              <span className="text-white/90">Access from anywhere</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        {children}
      </div>
    </div>
  );
}
