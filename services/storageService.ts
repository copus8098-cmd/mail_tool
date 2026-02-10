
import { User, UsageLog, Language, Tone, Category } from '../types';

const USER_KEY = 'promail_user';
const STATS_KEY = 'promail_stats';
const USAGE_KEY = 'promail_usage';

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  const user = JSON.parse(data);
  
  // Check daily reset
  const today = new Date().toDateString();
  if (user.lastResetDate !== today) {
    user.points = 100;
    user.lastResetDate = today;
    saveUser(user);
  }
  return user;
};

export const saveUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logUsage = (email: string, language: Language, tone: Tone, category: Category) => {
  const usageStr = localStorage.getItem(USAGE_KEY) || '[]';
  const usage: UsageLog[] = JSON.parse(usageStr);
  
  const newLog: UsageLog = {
    timestamp: new Date().toISOString(),
    email,
    language,
    tone,
    category
  };

  // Try to get location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      newLog.location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
      localStorage.setItem(USAGE_KEY, JSON.stringify([...usage, newLog]));
    }, () => {
      localStorage.setItem(USAGE_KEY, JSON.stringify([...usage, newLog]));
    });
  } else {
    localStorage.setItem(USAGE_KEY, JSON.stringify([...usage, newLog]));
  }
};

export const getUsageStats = (): UsageLog[] => {
  return JSON.parse(localStorage.getItem(USAGE_KEY) || '[]');
};

export const addVisit = () => {
  const visitsStr = localStorage.getItem(STATS_KEY) || '[]';
  const visits = JSON.parse(visitsStr);
  visits.push(new Date().toISOString());
  localStorage.setItem(STATS_KEY, JSON.stringify(visits));
};

export const getVisitCount = (): number => {
  return JSON.parse(localStorage.getItem(STATS_KEY) || '[]').length;
};
