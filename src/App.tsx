import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoForm } from './components/VideoForm';
import { ThemeToggle } from './components/ThemeToggle';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen py-8 px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              Video Downloader
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Download videos from YouTube, Twitter/X, TikTok, Instagram, and Threads
            </p>
          </div>
          
          <VideoForm />
        </div>
      </div>
    </QueryClientProvider>
  );
}
