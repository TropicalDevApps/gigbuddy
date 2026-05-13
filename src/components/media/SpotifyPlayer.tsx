import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface SpotifyPlayerRef {
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
}

interface SpotifyPlayerProps {
  token: string;
  isPlaying: boolean;
  onTrackChange: (track: { title: string; artist: string } | null) => void;
  onPlayChange: (playing: boolean) => void;
}

export const SpotifyPlayer = forwardRef<SpotifyPlayerRef, SpotifyPlayerProps>(
  ({ token, isPlaying, onTrackChange, onPlayChange }, ref) => {
    const [player, setPlayer] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      nextTrack: () => {
        if (player) player.nextTrack();
      },
      previousTrack: () => {
        if (player) player.previousTrack();
      },
      togglePlay: () => {
        if (player) player.togglePlay();
      },
    }));

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      (window as any).onSpotifyWebPlaybackSDKReady = () => {
        const spPlayer = new (window as any).Spotify.Player({
          name: "gigBuddy Stage Monitor",
          getOAuthToken: (cb: any) => {
            cb(token);
          },
          volume: 0.5,
        });

        spPlayer.addListener(
          "ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Spotify Ready with Device ID", device_id);
          },
        );

        spPlayer.addListener("player_state_changed", (state: any) => {
          if (!state) return;
          const track = state.track_window.current_track;
          onTrackChange(
            track ? { title: track.name, artist: track.artists[0].name } : null,
          );
          onPlayChange(!state.paused);
        });

        spPlayer.connect();
        setPlayer(spPlayer);
      };

      return () => {
        if (player) player.disconnect();
      };
    }, [token]);

    useEffect(() => {
      if (player) {
        if (isPlaying) {
          player.resume();
        } else {
          player.pause();
        }
      }
    }, [isPlaying, player]);

    return <div className="hidden">{/* Hidden Spotify Player */}</div>;
  },
);
