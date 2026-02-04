import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import SignInPage from './pages/SignInPage';
import FeedPage from './pages/FeedPage';
import ComposePostPage from './pages/ComposePostPage';
import CavesListPage from './pages/CavesListPage';
import CaveChatPage from './pages/CaveChatPage';
import ProfilePage from './pages/ProfilePage';
import JoinCavePage from './pages/JoinCavePage';
import PostDetailPage from './pages/PostDetailPage';
import AppShell from './components/layout/AppShell';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FeedPage,
});

const composeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compose',
  component: ComposePostPage,
});

const cavesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/caves',
  component: CavesListPage,
});

const caveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/caves/$caveId',
  component: CaveChatPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const joinCaveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join/$token',
  component: JoinCavePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postIndex',
  component: PostDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  composeRoute,
  cavesRoute,
  caveRoute,
  profileRoute,
  joinCaveRoute,
  postDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 dark:from-purple-950 dark:via-purple-900 dark:to-pink-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-700 dark:text-purple-300 font-medium">Loading TAZ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SignInPage />
        <Toaster />
      </ThemeProvider>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </ThemeProvider>
  );
}
