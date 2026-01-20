import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForYouScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Text category='h4' style={styles.headerTitle}>For You</Text>
                <Text category='s1' appearance='hint'>Personalized news based on your interests</Text>
            </Layout>
            <ScrollView style={styles.scrollView}>
                <Layout style={styles.content}>
                    <Text category='p1'>
                        Your personalized feed will appear here once you select your interests in Settings.
                    </Text>
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
});

export default ForYouScreen;
