import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Text, Toggle, Divider } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>Settings</Text>
            </Layout>
            <Divider />
            <ScrollView style={styles.scrollView}>
                <Layout style={styles.content}>
                    <Layout style={styles.settingItem}>
                        <Text category='s1'>Dark Mode</Text>
                        <Toggle
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                    </Layout>
                    <Divider style={styles.divider} />
                    <Layout style={styles.section}>
                        <Text category='h6' style={styles.sectionTitle}>Preferences</Text>
                        <Text category='p2' appearance='hint'>
                            More settings coming soon...
                        </Text>
                    </Layout>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    divider: {
        marginVertical: 8,
    },
    section: {
        marginTop: 16,
    },
    sectionTitle: {
        marginBottom: 8,
    },
});

export default SettingsScreen;
