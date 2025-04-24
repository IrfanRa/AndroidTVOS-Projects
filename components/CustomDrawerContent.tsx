import  { useEffect, useRef } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Text,
  Alert,
  BackHandler,
} from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
} from 'react-tv-space-navigation';
import { useRouter } from 'expo-router';
import { useMenuContext } from '@/components/MenuContext';
import { scaledPixels } from '@/hooks/useScale';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const navigation = useNavigation();

  // A ref to store the timeout ID for auto-closing
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null);

  // Drawer items
  const drawerItems = [
    { name: '/', label: 'Home' },
    { name: 'exit', label: 'Exit' },
  ];

  /** 
   * 1) Whenever the drawer is open, start or restart a 10-second timer.
   *    If time passes without user interaction, close the drawer.
   */ 
  useEffect(() => {
    // If drawer is open, set a 10 second auto-close
    if (isMenuOpen) {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
      autoCloseTimer.current = setTimeout(() => {
        navigation.dispatch(DrawerActions.closeDrawer());
        toggleMenu(false);
      }, 5000); // 10 seconds
    } else {
      // If not open, clear any existing timer
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    }
    // Cleanup if this component unmounts or dependency changes
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [isMenuOpen, navigation, toggleMenu]);

  /**
   * 2) handleItemSelect is called whenever user selects an item.
   *    We close the drawer (if Home), or exit the app, etc.
   *    Also, we clear the auto-close timer so it doesn't conflict.
   */
  const handleItemSelect = (item: { name: string; label: string }) => {
    // Clear the timer to avoid conflicts
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    try {
      if (item.name === 'exit') {
        Alert.alert(
          'Confirm Exit',
          'Are you sure you want to exit the app?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                try {
                  BackHandler.exitApp();
                } catch (error) {
                  console.error('Error exiting app:', error);
                }
              },
            },
          ],
          { cancelable: true }
        );
      } else if (item.name === 'index') {
        // Close drawer
        navigation.dispatch(DrawerActions.closeDrawer());
        toggleMenu(false);
        // Navigate to "index"
        setTimeout(() => {
          router.push({ pathname: '/' });
        }, 50);
      } else {
        // For any other route
        router.push({ pathname: item.name as '/' | '/(drawer)' | '/(drawer)/' | '/_sitemap' | '/configureRemoteControl' | '/details' | '/player' | '/remote-control/GoBackConfiguration' | `${string}:${string}` });
      }
    } catch (error) {
      console.error('Error handling drawer item selection:', error);
    }
  };

  return (
    <SpatialNavigationRoot isActive={isMenuOpen}>
      <DrawerContentScrollView
        {...props}
        style={styles.container}
        scrollEnabled={false}
        contentContainerStyle={{
          ...(Platform.OS === 'ios' &&
            Platform.isTV && {
              paddingStart: 0,
              paddingEnd: 0,
              paddingTop: 0,
            }),
        }}
      >
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.profilePic}
          />
          <Text style={styles.userName}>Subamerica Network TV</Text>
          <Text style={styles.switchAccount}>
          Discover shows by independent artists, musicians from the Americas!
          </Text>
        </View>

        {drawerItems.map((item, index) => (
          <DefaultFocus key={index}>
            <SpatialNavigationFocusableView
              onSelect={() => handleItemSelect(item)}
            >
              {({ isFocused }) => (
                <View
                  style={[
                    styles.menuItem,
                    isFocused && styles.menuItemFocused,
                  ]}
                >
                  <Text
                    style={[
                      styles.menuText,
                      isFocused && styles.menuTextFocused,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          </DefaultFocus>
        ))}
      </DrawerContentScrollView>
    </SpatialNavigationRoot>
  );
}

const useDrawerStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#28bdbb',
      paddingTop: scaledPixels(20),
    },
    header: {
      padding: scaledPixels(16),
      alignItems: 'flex-start',
    },
    profilePic: {
      width: scaledPixels(180),
      height: scaledPixels(180),
      borderRadius: scaledPixels(20),
      marginBottom: scaledPixels(20),
      marginLeft: scaledPixels(50),
    },
    userName: {
      color: 'white',
      fontSize: scaledPixels(32),
      marginBottom: scaledPixels(8),
      marginLeft: scaledPixels(50),
      textAlign: 'center',
    },
    switchAccount: {
      color: 'black',
      fontSize: scaledPixels(20),
      marginBottom: scaledPixels(20),
      marginLeft: scaledPixels(50),
      textAlign: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: scaledPixels(16),
      paddingBottom: scaledPixels(8),
      paddingStart: scaledPixels(32),
    },
    menuItemFocused: {
      backgroundColor: 'white',
    },
    menuText: {
      color: 'white',
      fontSize: scaledPixels(32),
      marginLeft: scaledPixels(60),
      textAlign: 'left',
    },
    menuTextFocused: {
      color: 'black',
    },
  });

const styles = useDrawerStyles();
