import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import customTheme from './src/theme/custom-theme.json';
import customMapping from './src/theme/mapping.json';

import { AuthProvider } from './src/context/AuthContext';

const linking = {
  config: {
    screens: {
      Main: {
        screens: {
          Tabs: '',
          ArticleDetail: 'news/:idOrSlug',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
    },
  },
};

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...eva[theme], ...customTheme }}
      customMapping={customMapping}
    >
      <NavigationContainer linking={linking}>
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
