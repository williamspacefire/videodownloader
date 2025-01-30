interface VideoInfo {
  title?: string;
  thumbnail?: string;
  duration?: number;
  formats: Array<{
    quality: string;
    format: string;
    url: string;
    hasAudio: boolean;
    hasVideo: boolean;
  }>;
}

const API_BASE = 'http://localhost:3000/api';

export const fetchVideoInfo = async (url: string, platform: string): Promise<VideoInfo> => {
  const response = await fetch(`${API_BASE}/${platform}/info?url=${encodeURIComponent(url)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch video info');
  }
  
  return response.json();
};
