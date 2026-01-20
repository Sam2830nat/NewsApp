import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

const CATEGORIES = ['All', 'Technology', 'Business', 'Sports', 'Health', 'Environment', 'Entertainment'];

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
    return (
        <Layout style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onSelectCategory(category)}
                        activeOpacity={0.7}
                    >
                        <Layout
                            style={[
                                styles.categoryChip,
                                selectedCategory === category && styles.categoryChipActive,
                            ]}
                        >
                            <Text
                                category='s2'
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </Layout>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E4E9F2',
    },
    categoryChipActive: {
        backgroundColor: '#FF8833',
        borderColor: '#FF8833',
    },
    categoryText: {
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
});

export default CategorySelector;
