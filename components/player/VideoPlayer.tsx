// ===========================
// File: VideoPlayer.tsx
// ===========================
import React from 'react';
import Video, { VideoRef } from 'react-native-video';
import { StyleSheet, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

interface VideoPlayerProps {
  movie: string;
  headerImage: string;
  paused: boolean;
  controls: boolean;
  onBuffer: (isBuffering: boolean) => void;
  onProgress: ({ currentTime }: { currentTime: number }) => void;
  onLoad: ({ duration }: { duration: number }) => void;
  onEnd: () => void;
  // ===========================
  // ADDED: onError callback prop
  // ===========================
  onError: (error: any) => void;
}

const VideoPlayer = React.forwardRef<VideoRef, VideoPlayerProps>(
  (
    {
      movie,
      headerImage,
      paused,
      controls,
      onBuffer,
      onProgress,
      onLoad,
      onEnd,
      onError,
    },
    ref,
  ) => {
    const styles = useVideoPlayerStyles();

    // ===========================
    // ADDED: Detect HLS (.m3u8) and set type for proper playback
    // ===========================
    const source = movie.endsWith('.m3u8')
      ? { uri: movie, type: 'm3u8' }
      : { uri: movie };

    return (
      <TouchableWithoutFeedback>
        <Video
          ref={ref}
          source={source}                // use typed source
          style={styles.video}
          controls={controls}
          paused={paused}
          onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
          onProgress={onProgress}
          onLoad={onLoad}
          onEnd={onEnd}
          // ===========================
          // ADDED: forward playback errors to parent
          // ===========================
          onError={({ error }) => onError(error)}
          poster={
            Platform.OS === 'web'
              ? {}
              : {
                  source: { uri: headerImage },
                  resizeMode: 'cover',
                  style: { width: '100%', height: '100%' },
                }
          }
          resizeMode="cover"
        />
      </TouchableWithoutFeedback>
    );
  },
);

const useVideoPlayerStyles = () => {
  return StyleSheet.create({
    video: {
      width: '100%',
      height: width * (9 / 16),
    },
  });
};

export default VideoPlayer;
