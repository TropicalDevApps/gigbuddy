import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface YouTubePlayerRef {
  togglePlay: () => void;
  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

interface YouTubePlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onPlayChange: (playing: boolean) => void;
  className?: string;
  visible?: boolean;
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(({ videoId, isPlaying, onPlayChange, className = "", visible = false }, ref) => {
  const playerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    togglePlay: () => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        const state = playerRef.current.getPlayerState();
        if (state === 1 || state === 3) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      }
    },
    seekForward: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime + seconds, true);
      }
    },
    seekBackward: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(Math.max(0, currentTime - seconds), true);
      }
    },
    seekTo: (seconds: number) => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, true);
      }
    },
    getCurrentTime: () => {
      return playerRef.current && typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
    },
    getDuration: () => {
      return playerRef.current && typeof playerRef.current.getDuration === 'function' ? playerRef.current.getDuration() : 0;
    }
  }));

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        if (videoId) playerRef.current.loadVideoById(videoId);
        return;
      }

      // If we already attempted construction but it's not ready, don't try again yet
      if (document.getElementById('yt-player')?.tagName === 'IFRAME') return;

      playerRef.current = new (window as any).YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId || 'M7lc1UVf-VE',
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          'onReady': () => {
            if (isPlaying && playerRef.current?.playVideo) {
              playerRef.current.playVideo();
            }
          },
          'onStateChange': (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) onPlayChange(true);
            if (event.data === (window as any).YT.PlayerState.PAUSED) onPlayChange(false);
          }
        }
      });
    };

    // Load YouTube API if not already present
    if (!(window as any).YT || !(window as any).YT.Player) {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
      
      const prevCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (err) {
        console.error("YouTube Player command failed:", err);
      }
    }
  }, [isPlaying]);

  return (
    <div className={`w-full aspect-video rounded-lg overflow-hidden bg-black ${visible ? 'block' : 'hidden'} ${className}`}>
      <div id="yt-player"></div>
    </div>
  );
});
