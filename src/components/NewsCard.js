import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';

const NewsCard = ({ article, onPress }) => {
    const { title, description, imageUrl, category, source, publishedAt, isBreaking } = article;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Card style={styles.card}>
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode='cover'
                    />
                )}
                <Layout style={styles.content}>
                    <View style={styles.metaContainer}>
                        {isBreaking && (
                            <View style={styles.breakingBadge}>
                                <Text category='c2' style={styles.breakingText}>BREAKING</Text>
                            </View>
                        )}
                        <Text category='c1' appearance='hint' style={styles.category}>
                            {category}
                        </Text>
                    </View>
                    <Text category='h6' style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text category='p2' appearance='hint' numberOfLines={2} style={styles.description}>
                        {description}
                    </Text>
                    <View style={styles.footer}>
                        <Text category='c1' appearance='hint'>{source}</Text>
                        <Text category='c1' appearance='hint'>{publishedAt}</Text>
                    </View>
                </Layout>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 8,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    content: {
        padding: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    breakingBadge: {
        backgroundColor: '#FF3D71',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    breakingText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    category: {
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    title: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    description: {
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default NewsCard;
