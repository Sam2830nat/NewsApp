import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { Layout, Text, Toggle, Divider, Button, CheckBox, Card } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/UserService';
import { getCategories } from '../services/CategoryService';

const SettingsScreen = ({ navigation }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout } = useAuth();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    // Topics could be a simple text input list or tag list, simplified to just categories for now

    // Fetch data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [cats, profile] = await Promise.all([
                    getCategories(),
                    getUserProfile()
                ]);

                setCategories(cats);
                if (profile.preferences && profile.preferences.categories) {
                    setSelectedCategories(profile.preferences.categories);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleCategory = (catId) => {
        if (selectedCategories.includes(catId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== catId));
        } else {
            setSelectedCategories([...selectedCategories, catId]);
        }
    };

    const savePreferences = async () => {
        try {
            await updateUserProfile({
                preferences: {
                    categories: selectedCategories
                }
            });
            alert('Preferences saved!');
        } catch (error) {
            alert('Failed to save preferences');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>Settings</Text>
            </Layout>
            <Divider />
            <ScrollView style={styles.scrollView}>
                <Layout style={styles.content}>
                    <Layout style={styles.section}>
                        <Text category='h6' style={styles.sectionTitle}>Appearance</Text>
                        <Layout style={styles.settingItem}>
                            <Text category='s1'>Dark Mode</Text>
                            <Toggle
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                        </Layout>
                    </Layout>

                    <Divider style={styles.divider} />

                    <Layout style={styles.section}>
                        <Text category='h6' style={styles.sectionTitle}>News Preferences</Text>
                        <Text category='p2' appearance='hint' style={{ marginBottom: 10 }}>
                            Select categories you are interested in for your "For You" feed.
                        </Text>

                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <View style={styles.chipContainer}>
                                {categories.map(cat => (
                                    <Button
                                        key={cat.id || cat._id}
                                        style={styles.chip}
                                        size='small'
                                        appearance={selectedCategories.includes(cat.id || cat._id) ? 'filled' : 'outline'}
                                        status='info'
                                        onPress={() => toggleCategory(cat.id || cat._id)}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </View>
                        )}

                        <Button style={styles.saveButton} onPress={savePreferences} disabled={loading}>
                            Save Preferences
                        </Button>
                    </Layout>

                    <Divider style={styles.divider} />

                    <Button status='danger' appearance='outline' onPress={logout} style={styles.logoutButton}>
                        Logout
                    </Button>
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
    section: {
        marginBottom: 16
    },
    sectionTitle: {
        marginBottom: 12
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    divider: {
        marginVertical: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16
    },
    chip: {
        margin: 4,
    },
    saveButton: {
        marginTop: 8
    },
    logoutButton: {
        marginTop: 20
    }
});

export default SettingsScreen;
