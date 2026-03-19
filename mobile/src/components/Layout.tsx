import React, {useMemo} from 'react';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {useColorScheme} from 'react-native';

const Layout = ({children}: {children: React.ReactNode}) => {
  const colorScheme = useColorScheme() || 'light';
  const {theme} = useMaterial3Theme();

  // Define Paper Theme
  const paperTheme = useMemo(() => {
    const baseTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    return {...baseTheme, colors: theme[colorScheme]};
  }, [colorScheme, theme]);

  // Define Navigation Theme
  const navigationTheme = useMemo(() => {
    const baseNavigationTheme =
      colorScheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
    return {
      ...baseNavigationTheme,
      colors: {
        ...baseNavigationTheme.colors,
        ...paperTheme.colors,
      },
    };
  }, [colorScheme, paperTheme]);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Layout;
