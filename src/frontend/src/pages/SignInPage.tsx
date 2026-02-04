import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/assets/generated/taz-bg-pattern.dim_1920x1080.png)' }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-pink-500/30" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <div className="space-y-4">
            <img 
              src="/assets/generated/taz-logo.dim_1200x300.png" 
              alt="TAZ" 
              className="h-20 mx-auto object-contain drop-shadow-2xl"
            />
            <p className="text-lg text-purple-700 dark:text-purple-300 font-medium">
              Connect. Share. Chat in Caves.
            </p>
          </div>

          {/* Sign in card */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-purple-200 dark:border-purple-800">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to TAZ
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to start sharing posts and chatting in Caves
              </p>
            </div>

            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              By signing in, you agree to our terms of service
            </p>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2026. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
