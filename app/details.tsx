import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View, Image, Text } from 'react-native';
import { SpatialNavigationRoot, DefaultFocus } from 'react-tv-space-navigation';
import { scaledPixels } from '@/hooks/useScale';
import { useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import FocusablePressable from '@/components/FocusablePressable';

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const { title, description, movie, headerImage } = params;

  const styles = useDetailsStyles();
  const router = useRouter();
  const isFocused = useIsFocused();

  const navigate = useCallback(() => {
    router.push({
      pathname: '/player',
      params: {
        movie: movie,
        headerImage: headerImage,
      },
    });
  }, [router, movie, headerImage]);

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image source={{ uri: Array.isArray(headerImage) ? headerImage[0] : headerImage }} style={styles.backgroundImage} />
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <View style={styles.topContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.bottomContent}>
            {/* You can add crew information here if needed */}
            <DefaultFocus>
              <FocusablePressable text={'Watch now'} onSelect={navigate} style={styles.watchButton} />
            </DefaultFocus>
          </View>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const useDetailsStyles = function () {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.9,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    contentContainer: {
      flex: 1,
      padding: scaledPixels(40),
      justifyContent: 'space-between',
    },
    topContent: {
      marginTop: scaledPixels(100),
    },
    bottomContent: {
      marginBottom: scaledPixels(40),
    },
    title: {
      fontSize: scaledPixels(54),
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: scaledPixels(20),
      marginTop: scaledPixels(440),
      marginLeft: scaledPixels(40),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    description: {
      fontSize: scaledPixels(30),
      color: '#fff',
      marginBottom: scaledPixels(20),
      marginTop: scaledPixels(10),
      marginLeft: scaledPixels(40),
      lineHeight: scaledPixels(32),
    },
    watchButton: {
      paddingHorizontal: scaledPixels(60),
      paddingVertical: scaledPixels(20),
      marginLeft: scaledPixels(40),
      backgroundColor: '#28bdbb',
      borderRadius: scaledPixels(10),

    },
  });
};
