import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface YoutubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export const youtubeService = {
  search: async (query: string): Promise<YoutubeSearchResult[]> => {
    if (!YOUTUBE_API_KEY) {
      console.warn("YouTube API Key missing. Please set VITE_YOUTUBE_API_KEY in .env");
      return [];
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 6,
          q: query,
          type: 'video',
          key: YOUTUBE_API_KEY,
        },
      });

      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
      }));
    } catch (error) {
      console.error("YouTube search failed", error);
      return [];
    }
  }
};
