import { DownloadHistory, RateLimit } from '../types';

const HISTORY_KEY = 'download_history';
const RATE_LIMIT_KEY = 'rate_limit';

export const storage = {
  getHistory: (): DownloadHistory[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToHistory: (download: DownloadHistory) => {
    const history = storage.getHistory();
    history.unshift(download);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  },

  getRateLimit: (): RateLimit => {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    return data ? JSON.parse(data) : { count: 0, resetAt: Date.now() + 3600000 };
  },

  updateRateLimit: () => {
    const limit = storage.getRateLimit();
    const now = Date.now();

    if (now > limit.resetAt) {
      const newLimit = { count: 1, resetAt: now + 3600000 };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newLimit));
      return true;
    }

    if (limit.count >= 5) return false;

    limit.count += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limit));
    return true;
  }
};
