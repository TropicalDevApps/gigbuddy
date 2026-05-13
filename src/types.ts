export enum SongStatus {
  PLAYING = 'playing',
  UP_NEXT = 'up_next',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export interface ChordNote {
  chord: string;
  position: number; // Index in the text line
}

export interface LyricsLine {
  text: string;
  chords: ChordNote[];
}

export interface SongSection {
  title: string; // e.g., "Verse 1", "Chorus"
  lines: LyricsLine[];
}

export interface Attachment {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'image' | 'link';
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  key: string;
  bpm?: number;
  duration: number; // in seconds
  sections: SongSection[];
  notes: string[];
  streamingUrl?: string; // Spotify reference
  capo?: number;
  status?: SongStatus;
  youtubeId?: string;
  attachments?: Attachment[];
}

export interface SetlistItem {
  id: string;
  songId: string;
  order: number;
  status: SongStatus;
}

export interface BandSession {
  id: string;
  name: string;
  activeSongId: string | null;
  activeSectionIndex: number | null;
  syncedMemberUids: string[];
  setlist: SetlistItem[];
  sessionNotes?: string;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  bio: string;
  stageLayout?: string[];
  stageVisibility?: Record<string, boolean>;
  updatedAt: any;
}

export interface Band {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  createdAt: any;
  accentColor?: string;
  fontFamily?: string;
}

export interface SavedSetlist {
  id: string;
  title: string;
  songs: Song[];
  bandId: string;
  authorId: string;
  createdAt: any;
}

export interface SyncTask {
  id: string;
  type: 'song_save' | 'band_update' | 'profile_update';
  bandId?: string;
  uid?: string;
  payload: any;
  timestamp: number;
}
