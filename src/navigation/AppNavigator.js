import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import HomeScreen from '../screens/HomeScreen';
import ForYouScreen from '../screens/ForYouScreen';
import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';

const { Navigator, Screen } = createBottomTabNavigator();

const HomeIcon = (props) => <Icon {...props} name='home-outline' />;
const PersonIcon = (props) => <Icon {...props} name='person-outline' />;
const BookmarkIcon = (props) => <Icon {...props} name='bookmark-outline' />;
const SettingsIcon = (props) => <Icon {...props} name='settings-outline' />;

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Home' icon={HomeIcon} />
        <BottomNavigationTab title='For You' icon={PersonIcon} />
        <BottomNavigationTab title='Saved' icon={BookmarkIcon} />
        <BottomNavigationTab title='Settings' icon={SettingsIcon} />
    </BottomNavigation>
);

const AppNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Screen name='Home' component={HomeScreen} />
        <Screen name='ForYou' component={ForYouScreen} />
        <Screen name='Saved' component={SavedScreen} />
        <Screen name='Settings' component={SettingsScreen} />
    </Navigator>
);

export default AppNavigator;
