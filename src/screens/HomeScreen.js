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
        // selectedCategory is now an ID (or 'All')
        try {
            const articles = await getTopHeadlines(selectedCategory);

            // Transform API data to match our component structure
            // Backend returns: _id, title, content, image, category, author, createdAt
            const formattedNews = articles.map((item, index) => ({
                id: item.id || item._id, // Handle both id formats
                slug: item.slug,
                title: item.title,
                description: item.content ? item.content.substring(0, 100) + '...' : '',
                imageUrl: item.image, // Backend uses 'image'
                category: item.category ? item.category.name : 'General',
                source: item.author ? item.author.name : 'Unknown',
                publishedAt: new Date(item.createdAt).toLocaleDateString(),
                isBreaking: index === 0,
                content: item.content
            }));

            setNews(formattedNews);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [selectedCategory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNews();
        setRefreshing(false);
    };

    const handlePress = (article) => {
        navigation.navigate('ArticleDetail', { idOrSlug: article.id });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>NewsApp</Text>
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
                            <NewsCard
                                key={item.id}
                                article={item}
                                onPress={() => handlePress(item)}
                            />
                        ))
                    )}
                    {news.length === 0 && !loading && (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>No news found.</Text>
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
