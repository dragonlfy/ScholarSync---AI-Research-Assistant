export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  summary: string;
  url: string;
  publisher: string;
  selected: boolean;
}

export interface SearchFilters {
  query: string;
  yearStart: number;
  yearEnd: number;
  minCitations: number;
  maxResults: number; // Added to control quantity
  downloadPath: string; // Simulated path or folder name
}

export enum SearchStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}