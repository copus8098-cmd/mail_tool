
export enum Language {
  ARABIC = 'Arabic',
  ENGLISH = 'English',
  FRENCH = 'French',
  SPANISH = 'Spanish',
  GERMAN = 'German'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  URGENT = 'Urgent',
  PERSUASIVE = 'Persuasive',
  FORMAL = 'Formal'
}

export enum Category {
  JOB_APPLICATION = 'Job Application',
  MEETING_REQUEST = 'Meeting Request',
  FOLLOW_UP = 'Follow-up',
  NETWORKING = 'Networking',
  RESIGNATION = 'Resignation',
  COMPLAINT = 'Complaint',
  THANK_YOU = 'Thank You',
  GENERAL = 'General Business'
}

export interface EmailRequest {
  description: string;
  language: Language;
  tone: Tone;
  category: Category;
}

export interface EmailResponse {
  subject: string;
  body: string;
}

export interface User {
  email: string;
  points: number;
  lastResetDate: string; // ISO Date
  isAdmin: boolean;
}

export interface UsageLog {
  timestamp: string;
  email: string;
  language: Language;
  tone: Tone;
  category: Category;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface VisitLog {
  timestamp: string;
  location?: string;
}
