import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import customTheme from './src/theme/custom-theme.json';
import customMapping from './src/theme/mapping.json';

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...eva[theme], ...customTheme }}
      customMapping={customMapping}
    >
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ApplicationProvider>
  );
};

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </>
  );
}
