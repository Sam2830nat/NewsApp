import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, RefreshControl } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getForYouNews } from '../services/NewsService';
import NewsCard from '../components/NewsCard';
import { useFocusEffect } from '@react-navigation/native';

const ForYouScreen = ({ navigation }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const articles = await getForYouNews();
            const formattedNews = articles.map((item, index) => ({
                id: item.id || item._id,
                slug: item.slug,
                title: item.title,
                description: item.content ? item.content.substring(0, 100) + '...' : '',
                imageUrl: item.image,
                category: item.category ? item.category.name : 'General',
                source: item.author ? item.author.name : 'Unknown',
                publishedAt: new Date(item.createdAt).toLocaleDateString(),
                isBreaking: false,
                content: item.content
            }));
            setNews(formattedNews);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFeed();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFeed();
        setRefreshing(false);
    };

    const handlePress = (article) => {
        navigation.navigate('ArticleDetail', { idOrSlug: article.id });
    };


    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>For You</Text>
                <Text category='s1' appearance='hint'>Personalized news based on your interests</Text>
            </Layout>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Layout style={styles.content}>
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#FF8833" />
                        </View>
                    ) : news.length > 0 ? (
                        news.map((item) => (
                            <NewsCard key={item.id} article={item} onPress={() => handlePress(item)} />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text category='p1' style={{ textAlign: 'center', marginBottom: 10 }}>
                                No personalized news found yet. Adjust your settings to see more.
                            </Text>
                            <Button size='small' onPress={() => navigation.navigate('Settings')}>
                                Go to Settings
                            </Button>
                        </View>
                    )}
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
        marginBottom: 4,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    loaderContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ForYouScreen;
