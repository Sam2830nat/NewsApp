import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, View, TouchableOpacity, Share } from 'react-native';
import { Layout, Text, Button, Input, Icon, Spinner, Divider, StyleService, useStyleSheet, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ArticleDetailScreen = ({ route, navigation }) => {
    const { idOrSlug } = route.params;
    const styles = useStyleSheet(themedStyles);
    const theme = useTheme();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [replyTo, setReplyTo] = useState(null);

    const { user } = useAuth();

    const fetchArticle = async () => {
        if (!idOrSlug || idOrSlug === 'undefined' || idOrSlug === 'null') {
            setLoading(false);
            setError('Invalid article link');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            console.log(`[AUTH_APP] Fetching article: ${idOrSlug}`);
            const response = await api.get(`/news/${idOrSlug}`);

            console.log(`[AUTH_APP] Received article: ${response.data.title}`);
            console.log(`[AUTH_APP] Comments received: ${response.data.comments?.length || 0}`);

            setArticle(response.data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError(error.response?.data?.message || 'Failed to load article');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [idOrSlug]);

    const handleShare = async () => {
        if (!article) return;
        try {
            await Share.share({
                message: `${article.title}\n\nRead more at GeminiNews`,
                url: `gemininews://news/${article.slug || article.id}`
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/comments', {
                content: commentText,
                articleId: article.id,
                parentId: replyTo ? replyTo.id : undefined
            });
            setCommentText('');
            setReplyTo(null);
            fetchArticle();
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            fetchArticle();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    }

    const getRandomColor = (id) => {
        const colors = ['#3366FF', '#00D68F', '#FFAB00', '#FF3D71', '#8F9BB3', '#222B45'];
        const index = id ? parseInt(id.substring(id.length - 1), 16) % colors.length : 0;
        return colors[index];
    }

    if (loading) {
        return (
            <Layout style={styles.centerContainer}>
                <Spinner size='large' />
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout style={styles.centerContainer}>
                <Icon name='alert-circle-outline' fill={theme['color-danger-500']} style={styles.errorIcon} />
                <Text category='h6' style={styles.errorText}>{error}</Text>
                <Button status='primary' onPress={fetchArticle} appearance='outline'>Try Again</Button>
            </Layout>
        );
    }

    if (!article) return null;

    const renderComment = (comment, isReply = false) => (
        <View key={comment.id} style={[styles.commentCard, isReply && styles.replyCard]}>
            <View style={styles.commentHeader}>
                <View style={styles.commenterInfo}>
                    <View style={[styles.avatar, { backgroundColor: getRandomColor(comment.userId) }]}>
                        <Text style={styles.avatarText}>{getInitials(comment.user.name)}</Text>
                    </View>
                    <View>
                        <Text category='s1' style={styles.commentName}>
                            {comment.user.name}
                            {article.authorId === comment.userId && (
                                <Text category='c1' status='primary' style={styles.authorBadge}> • Author</Text>
                            )}
                        </Text>
                        <Text category='c1' appearance='hint' style={styles.timestamp}>{new Date(comment.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
                {(user && user.role === 'ADMIN' || user?.id === comment.userId) && (
                    <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                        <Icon name='trash-2-outline' fill={theme['color-danger-500']} style={styles.trashIcon} />
                    </TouchableOpacity>
                )}
            </View>

            <Text category='p2' style={styles.commentContent}>{comment.content}</Text>

            {!isReply && (
                <View style={styles.commentActions}>
                    <TouchableOpacity
                        style={styles.replyActionButton}
                        onPress={() => setReplyTo(comment)}
                    >
                        <Icon name='message-square-outline' fill={theme['color-primary-500']} style={styles.replyActionIcon} />
                        <Text category='c1' status='primary'>Reply</Text>
                    </TouchableOpacity>
                </View>
            )}

            {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Layout style={styles.header}>
                <Button
                    appearance='ghost'
                    accessoryLeft={props => <Icon {...props} name='arrow-back' />}
                    onPress={() => navigation.goBack()}
                />
                <Text category='s1' style={styles.headerTitle} numberOfLines={1}>{article.title}</Text>
                <TouchableOpacity onPress={handleShare} style={styles.headerIconButton}>
                    <Icon name='share-outline' fill={theme['text-basic-color']} style={styles.headerIcon} />
                </TouchableOpacity>
            </Layout>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {article.image && (
                    <Image source={{ uri: article.image }} style={styles.image} />
                )}

                <Layout style={styles.content}>
                    <View style={styles.categoryBadgeContainer}>
                        <View style={styles.categoryBadge}>
                            <Text category='c2' style={styles.categoryBadgeText}>{article.category.name.toUpperCase()}</Text>
                        </View>
                        <View style={styles.viewsContainer}>
                            <Icon name='eye-outline' fill={theme['text-hint-color']} style={styles.viewIcon} />
                            <Text category='c1' appearance='hint'>{article.views} views</Text>
                        </View>
                    </View>

                    <Text category='h1' style={styles.title}>{article.title}</Text>

                    <View style={styles.metaRow}>
                        {article.author && (
                            <View style={styles.authorSection}>
                                <View style={[styles.avatarMini, { backgroundColor: getRandomColor(article.authorId) }]}>
                                    <Text style={styles.avatarMiniText}>{getInitials(article.author.name)}</Text>
                                </View>
                                <Text category='s2' style={styles.authorName}>{article.author.name}</Text>
                            </View>
                        )}
                        <Text category='c1' appearance='hint' style={styles.dateText}>{new Date(article.createdAt).toDateString()}</Text>
                    </View>

                    <Divider style={styles.bodyDivider} />
                    <Text category='p1' style={styles.body}>{article.content}</Text>
                </Layout>

                <Layout style={styles.footerDividerSection}>
                    <Divider style={styles.sectionDivider} />
                    <Text category='c1' appearance='hint' style={styles.motivationText}>JOIN THE CONVERSATION</Text>
                </Layout>

                <Layout style={styles.commentsSection}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text category='h4' style={styles.sectionTitle}>Discussion ({article.comments?.length || 0})</Text>
                            {article.debug_version && (
                                <Text category='c1' appearance='hint' style={styles.debugBadge}>Server: {article.debug_version}</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={fetchArticle} style={styles.refreshButton}>
                            <Icon name='refresh-outline' fill={theme['color-primary-500']} style={styles.refreshIcon} />
                        </TouchableOpacity>
                    </View>

                    {article.comments && article.comments.length > 0 ? (
                        article.comments.map(c => renderComment(c))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Icon name='message-circle-outline' fill={theme['background-basic-color-3']} style={styles.emptyIcon} />
                            <Text style={styles.emptyComments}>No comments yet. Start the conversation!</Text>
                        </View>
                    )}
                </Layout>
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <Layout style={styles.inputContainer} level='3'>
                    {replyTo && (
                        <View style={styles.replyingToBar}>
                            <View style={styles.replyingToInfo}>
                                <Icon name='corner-down-right-outline' fill={theme['color-primary-500']} style={styles.replyIcon} />
                                <Text category='c1'>
                                    Replying to <Text category='s2' style={styles.replyToName}>{replyTo.user.name}</Text>
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setReplyTo(null)}>
                                <Icon name='close-outline' fill={theme['text-hint-color']} style={styles.closeIcon} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputRow}>
                        <Input
                            style={styles.input}
                            placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline={true}
                            textStyle={styles.inputText}
                            size='large'
                        />
                        <Button
                            style={styles.sendButton}
                            size='large'
                            onPress={handlePostComment}
                            disabled={submitting || !commentText.trim()}
                            accessoryLeft={props => submitting ? <Spinner {...props} size='small' status='control' /> : <Icon {...props} name='paper-plane' />}
                        />
                    </View>
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const themedStyles = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-1',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'background-basic-color-1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: 'background-basic-color-2',
        backgroundColor: 'background-basic-color-1',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
        color: 'text-basic-color',
        fontWeight: 'bold',
        fontSize: 16
    },
    headerIconButton: {
        padding: 8,
        marginRight: 4
    },
    headerIcon: {
        width: 24,
        height: 24
    },
    scrollContent: {
        paddingBottom: 40
    },
    image: {
        width: '100%',
        height: 280,
        backgroundColor: 'background-basic-color-2'
    },
    content: {
        padding: 24,
        backgroundColor: 'background-basic-color-1',
    },
    categoryBadgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryBadge: {
        backgroundColor: 'color-primary-500',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 2,
    },
    categoryBadgeText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 11,
        letterSpacing: 1
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewIcon: {
        width: 14,
        height: 14,
        marginRight: 6
    },
    title: {
        marginBottom: 20,
        fontWeight: '800',
        lineHeight: 40,
        color: 'text-basic-color',
        fontSize: 32
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    authorName: {
        marginLeft: 10,
        color: 'text-basic-color',
        fontWeight: '700'
    },
    dateText: {
        fontSize: 13,
        color: 'text-hint-color'
    },
    bodyDivider: {
        height: 1.5,
        backgroundColor: 'color-primary-500',
        width: 40,
        marginBottom: 24
    },
    body: {
        lineHeight: 32,
        fontSize: 18,
        color: 'text-basic-color',
        fontWeight: '400'
    },
    footerDividerSection: {
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: 'background-basic-color-1',
    },
    motivationText: {
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 10,
        marginTop: 12,
        textAlign: 'center',
        color: 'text-hint-color'
    },
    sectionDivider: {
        backgroundColor: 'background-basic-color-3'
    },
    commentsSection: {
        paddingHorizontal: 24,
        backgroundColor: 'background-basic-color-1',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 10
    },
    sectionTitle: {
        fontWeight: '800',
        color: 'text-basic-color'
    },
    refreshButton: {
        padding: 4
    },
    refreshIcon: {
        width: 24,
        height: 24
    },
    debugBadge: {
        fontSize: 10,
        opacity: 0.5,
        marginTop: 2
    },
    commentCard: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'background-basic-color-2'
    },
    replyCard: {
        marginLeft: 32,
        marginTop: 20,
        paddingBottom: 12,
        borderBottomWidth: 0,
        borderLeftWidth: 3,
        borderLeftColor: 'background-basic-color-2',
        paddingLeft: 20
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14
    },
    commenterInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentName: {
        color: 'text-basic-color',
        fontWeight: '700',
        fontSize: 16
    },
    timestamp: {
        fontSize: 12,
        marginTop: 2
    },
    authorBadge: {
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: 'color-primary-100',
        color: 'color-primary-500',
        paddingHorizontal: 4,
        borderRadius: 2
    },
    commentContent: {
        color: 'text-basic-color',
        lineHeight: 24,
        fontSize: 15,
        marginBottom: 12
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: 'background-basic-color-2'
    },
    replyActionIcon: {
        width: 14,
        height: 14,
        marginRight: 6
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    avatarMini: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarMiniText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 11
    },
    trashIcon: {
        width: 20,
        height: 20
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50
    },
    emptyIcon: {
        width: 80,
        height: 80,
        marginBottom: 20
    },
    emptyComments: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontSize: 15,
        fontWeight: '500'
    },
    inputContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 1,
        borderTopColor: 'background-basic-color-3',
        backgroundColor: 'background-basic-color-1',
    },
    replyingToBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'background-basic-color-2',
        padding: 10,
        borderRadius: 4,
    },
    replyingToInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    replyIcon: {
        width: 18,
        height: 18,
        marginRight: 10
    },
    replyToName: {
        color: 'color-primary-500',
        fontWeight: 'bold'
    },
    closeIcon: {
        width: 20,
        height: 20
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        marginRight: 14,
    },
    inputText: {
        minHeight: 48,
        fontSize: 16,
        color: 'text-basic-color'
    },
    sendButton: {
        width: 52,
        height: 52,
        borderRadius: 26
    },
    errorIcon: {
        width: 80,
        height: 80,
        marginBottom: 20
    },
    errorText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700'
    }
});

export default ArticleDetailScreen;
