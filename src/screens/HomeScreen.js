import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl, ActivityIndicator, View } from 'react-native';
import { Layout, Text, Divider } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategorySelector from '../components/CategorySelector';
import NewsCard from '../components/NewsCard';
import { getTopHeadlines } from '../services/NewsService';

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [news, setNews] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        setLoading(true);
        const categoryParam = selectedCategory === 'All' ? 'general' : selectedCategory.toLowerCase();
        const articles = await getTopHeadlines(categoryParam);

        // Transform API data to match our component structure
        const formattedNews = articles.map((item, index) => ({
            id: index.toString(),
            title: item.title,
            description: item.description,
            imageUrl: item.urlToImage,
            category: selectedCategory === 'All' ? 'General' : selectedCategory,
            source: item.source.name,
            publishedAt: new Date(item.publishedAt).toLocaleDateString(),
            isBreaking: index === 0, // First item is breaking (simplified logic)
            url: item.url,
            content: item.content
        }));

        setNews(formattedNews);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, [selectedCategory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNews();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>GeminiNews</Text>
            </Layout>
            <Divider />
            <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
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
                    ) : (
                        news.map((item) => (
                            <NewsCard key={item.id} article={item} onPress={() => { }} />
                        ))
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
});

export default HomeScreen;
