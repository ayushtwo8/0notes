import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/notes') ||
        nextUrl.pathname.startsWith('/folders') ||
        nextUrl.pathname.startsWith('/tags') ||
        nextUrl.pathname.startsWith('/archive') ||
        nextUrl.pathname.startsWith('/trash') ||
        nextUrl.pathname.startsWith('/settings');
      const isOnAuth = nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/register') ||
        nextUrl.pathname.startsWith('/forgot-password');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
