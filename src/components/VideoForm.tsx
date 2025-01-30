import { useState } from 'react';
import { Platform } from '../types';
import { validateUrl, detectPlatform } from '../utils/validators';
import { fetchVideoInfo } from '../api';
import clsx from 'clsx';

export const VideoForm = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError('');
    setVideoInfo(null);
    const detectedPlatform = detectPlatform(newUrl);
    setPlatform(detectedPlatform);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVideoInfo(null);

    if (!validateUrl(url)) {
      setError('Please enter a valid video URL');
      return;
    }

    if (!platform) {
      setError('This video platform is not supported');
      return;
    }

    setLoading(true);
    try {
      const info = await fetchVideoInfo(url, platform);
      setVideoInfo(info);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Video URL
          </label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Paste video URL from any supported platform"
            className={clsx(
              "w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800",
              "focus:ring-2 focus:ring-blue-500 focus:outline-none",
              "dark:border-gray-600",
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            )}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {platform && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Detected Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </p>
        )}

        <button 
          type="submit" 
          disabled={!platform || loading}
          className={clsx(
            "w-full px-4 py-2 rounded-lg font-medium",
            "transition-colors duration-200",
            loading ? "bg-gray-400 cursor-wait" :
            platform
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
          )}
        >
          {loading ? 'Loading...' : 'Get Video Info'}
        </button>
      </form>

      {videoInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-medium mb-4">Video Information</h3>
          {videoInfo.title && (
            <p className="mb-2">Title: {videoInfo.title}</p>
          )}
          {videoInfo.thumbnail && (
            <img 
              src={videoInfo.thumbnail} 
              alt="Video thumbnail" 
              className="w-full max-w-md mx-auto rounded mb-4"
            />
          )}
          <div className="space-y-2">
            <h4 className="font-medium">Available Formats:</h4>
            {videoInfo.formats.map((format: any, index: number) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span>
                  {format.quality} - {format.format}
                  {format.hasAudio && ' (with audio)'}
                </span>
                <a
                  href={format.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
