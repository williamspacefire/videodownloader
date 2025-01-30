import { Platform } from '../types';

const platformPatterns = {
  youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
  twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+$/,
  tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
  instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
  threads: /^(https?:\/\/)?(www\.)?threads\.net\/.+$/
};

export const detectPlatform = (url: string): Platform | null => {
  for (const [platform, pattern] of Object.entries(platformPatterns)) {
    if (pattern.test(url)) {
      return platform as Platform;
    }
  }
  return null;
};

export const validateUrl = (url: string): boolean => {
  return Object.values(platformPatterns).some(pattern => pattern.test(url));
};
