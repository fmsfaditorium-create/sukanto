
export interface Category {
  id: string;
  name: string;   // English name (e.g., 'Grammar')
  labelBn: string; // Bengali label (e.g., 'ইংলিশ গ্রামার')
}

export type CategoryType = string;

export interface ContentItem {
  id: string;
  title: string;
  titleBn: string;
  category: CategoryType;
  subCategory?: string;
  excerpt: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserSession {
  name: string;
  mobile: string;
  device: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  lastActive: number;
  id: string;
}
