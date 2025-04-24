import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useMenuContext } from '../../components/MenuContext';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
  SpatialNavigationVirtualizedList,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '@/hooks/useScale';
import { LinearGradient } from 'expo-linear-gradient';

export default function IndexScreen() {
  const styles = useGridStyles();
  const router = useRouter();
  const navigation = useNavigation();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const [moviesData, setMoviesData] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  interface MovieItem {
    title: string;
    description: string;
    imgURL: string;
    thumbURL: string;
    videoURL: string;
    categories: string[];
  }

  const [focusedItem, setFocusedItem] = useState<MovieItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data and Process Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://otttelemaerica.com/feed/FTVSubamerica.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMoviesData(data);

        // Process categories
        const categories: { [key: string]: any[] } = {};
        data.forEach((item: { categories: any[]; }) => {
          item.categories.forEach((category) => {
            if (!categories[category]) {
              categories[category] = [];
            }
            categories[category].push(item);
          });
        });
        setCategoriesMap(categories);

        // Set initial focused item
        if (data.length > 0) {
          setFocusedItem(data[0]);
        }
      } catch (error) {
        setError((error as any).message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderHeader = useCallback(() => {
    if (!focusedItem) return null;

    return (
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={{
            uri: focusedItem.imgURL,
          }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientLeft}
        />
        <LinearGradient
          colors={['rgb(0,0,0)', 'rgba(0,0,0, 0.3)', 'transparent']}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBottom}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{focusedItem.title}</Text>
          <Text style={styles.headerDescription}>{focusedItem.description}</Text>
        </View>
      </View>
    );
  }, [focusedItem, styles]);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      console.log('Direction ' + movement);
      if (movement === 'left') {
        try {
          navigation.dispatch(DrawerActions.openDrawer());
          toggleMenu(true);
        } catch (err) {
          console.error('Error opening drawer:', err);
        }
      }
    },
    [toggleMenu, navigation],
  );

  const renderScrollableRow = useCallback(
    (title: string, items: any[]) => {
      if (items.length === 0) return null;

      const renderItem = ({ item }: { item: MovieItem }) => (
        <SpatialNavigationFocusableView
          onSelect={() => {
            try {
              router.push({
                pathname: '/details',
                params: {
                  title: item.title,
                  description: item.description,
                  headerImage: item.imgURL,
                  movie: item.videoURL,
                },
              });
            } catch (err) {
              console.error('Error navigating to detailss:', err);
            }
          }}
          onFocus={() => setFocusedItem(item)}>
          {({ isFocused }) => (
            <View style={[styles.highlightThumbnail, isFocused && styles.highlightThumbnailFocused]}>
              <Image source={{ uri: item.thumbURL }} style={styles.thumbnailImage} />
              <View style={styles.thumbnailTextContainer}>
                <Text style={styles.thumbnailText}>{item.title}</Text>
              </View>
            </View>
          )}
        </SpatialNavigationFocusableView>
      );

      return (
        <View style={styles.highlightsContainer}>
          <Text style={styles.highlightsTitle}>{title}</Text>
          <SpatialNavigationNode>
            <DefaultFocus>
              <SpatialNavigationVirtualizedList
                data={items}
                orientation="horizontal"
                renderItem={renderItem}
                itemSize={scaledPixels(425)}
                numberOfRenderedItems={6}
                numberOfItemsVisibleOnScreen={4}
                onEndReachedThresholdItemsNumber={3}
              />
            </DefaultFocus>
          </SpatialNavigationNode>
        </View>
      );
    },
    [styles, router],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator
        color="#ffffff"
        size="large" // iOS only supports 'small' or 'large'
        style={styles.bigIndicator}
      />
    </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={styles.container}>
        {renderHeader()}
        <SpatialNavigationScrollView offsetFromStart={scaledPixels(60)} style={styles.scrollContent}>
          {Object.entries(categoriesMap).map(([categoryName, items]) => (
            <View key={categoryName}>{renderScrollableRow(categoryName, items as any[])}</View>
          ))}
        </SpatialNavigationScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const useGridStyles = function () {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    scrollContent: {
      flex: 1,
      marginBottom: scaledPixels(48),
      marginLeft: 12,
    },
    highlightsTitle: {
      color: '#fff',
      fontSize: scaledPixels(34),
      fontWeight: 'bold',
      marginBottom: scaledPixels(10),
      marginTop: scaledPixels(15),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    headerTitle: {
      color: '#fff',
      fontSize: scaledPixels(48),
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
      marginLeft: 40,
    },
    headerDescription: {
      color: '#fff',
      fontSize: scaledPixels(24),
      fontWeight: '500',
      paddingTop: scaledPixels(16),
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
      marginLeft: 40,
    },
    thumbnailTextContainer: {
      position: 'absolute',
      bottom: scaledPixels(10),
      left: scaledPixels(10),
      right: scaledPixels(10),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: scaledPixels(5),
      borderRadius: scaledPixels(3),
    },
    thumbnailText: {
      color: '#fff',
      fontSize: scaledPixels(18),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    highlightThumbnail: {
      width: scaledPixels(400),
      height: scaledPixels(240),
      marginRight: scaledPixels(10),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: scaledPixels(5),
    },
    highlightThumbnailFocused: {
      borderColor: '#fff',
      borderWidth: scaledPixels(4),
    },
    highlightsContainer: {
      padding: scaledPixels(10),
      height: scaledPixels(360),
    },
    header: {
      width: '100%',
      height: scaledPixels(700),
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: scaledPixels(5),
    },
    gradientLeft: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    gradientBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '25%',
    },
    headerTextContainer: {
      position: 'absolute',
      left: scaledPixels(40),
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      width: '50%',
    },
    errorText: {
      color: '#fff',
      fontSize: scaledPixels(24),
      textAlign: 'center',
      marginTop: scaledPixels(20),
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bigIndicator: {
      transform: [{ scale: 2 }],
    },
  });
};
