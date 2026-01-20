import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, BottomNavigationTab, Icon, Layout, Spinner } from '@ui-kitten/components';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import ForYouScreen from '../screens/ForYouScreen';
import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

const { Navigator: TabNavigator, Screen: TabScreen } = createBottomTabNavigator();
const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator();

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

const MainTabNavigator = () => (
    <TabNavigator tabBar={props => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <TabScreen name='Home' component={HomeScreen} />
        <TabScreen name='ForYou' component={ForYouScreen} />
        <TabScreen name='Saved' component={SavedScreen} />
        <TabScreen name='Settings' component={SettingsScreen} />
    </TabNavigator>
);

const MainStack = () => (
    <StackNavigator screenOptions={{ headerShown: false }}>
        <StackScreen name='Tabs' component={MainTabNavigator} />
        <StackScreen name='ArticleDetail' component={ArticleDetailScreen} />
    </StackNavigator>
);

const AuthStackNavigator = () => (
    <StackNavigator screenOptions={{ headerShown: false }}>
        <StackScreen name='Login' component={LoginScreen} />
        <StackScreen name='Register' component={RegisterScreen} />
    </StackNavigator>
);

const AppNavigator = () => {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size='large' />
            </Layout>
        );
    }

    return (
        <StackNavigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                <StackScreen name='Main' component={MainStack} />
            ) : (
                <StackScreen name='Auth' component={AuthStackNavigator} />
            )}
        </StackNavigator>
    );
};

export default AppNavigator;
