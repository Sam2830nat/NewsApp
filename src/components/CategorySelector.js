import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { getCategories } from '../services/CategoryService';

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            // Add 'All' option manually
            setCategories([{ id: 'All', name: 'All' }, ...data]);
        };
        fetchCategories();
    }, []);

    return (
        <Layout style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => onSelectCategory(category.id)}
                        activeOpacity={0.7}
                    >
                        <Layout
                            style={[
                                styles.categoryChip,
                                selectedCategory === category.id && styles.categoryChipActive,
                            ]}
                        >
                            <Text
                                category='s2'
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category.id && styles.categoryTextActive,
                                ]}
                            >
                                {category.name}
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
