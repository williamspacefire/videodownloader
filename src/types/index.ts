export type Platform = 'youtube' | 'twitter' | 'tiktok' | 'instagram' | 'threads';

export interface VideoMetadata {
  id: string;
  title: string;
  platform: Platform;
  url: string;
  availableQualities: string[];
  availableFormats: string[];
  thumbnail?: string;
  duration?: number;
}

export interface DownloadHistory {
  id: string;
  url: string;
  platform: Platform;
  downloadedAt: string;
  quality: string;
  format: string;
}

export interface RateLimit {
  count: number;
  resetAt: number;
}
