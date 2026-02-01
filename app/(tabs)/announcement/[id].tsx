import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAnnouncements } from '@/stores/announcementsStores';
import { useUserStore } from '@/stores/userStores';
import ReturnIcon from "@/assets/images/return.svg";
import {goToProfile} from "@/utils/navigation";

export default function AnnouncementDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const announcementId = Number(id);

    const { announcements, toggleParticipation, addComment } = useAnnouncements();
    const currentUser = useUserStore(state => state.currentUser);

    const announcement = announcements.find(a => a.id === announcementId);

    const [commentText, setCommentText] = useState('');
    const [sendingComment, setSendingComment] = useState(false);

    if (isNaN(announcementId) || !announcement) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Объявление не найдено</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Вернуться назад</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isPending = announcement.pendingParticipants.includes(currentUser?.id ?? 0);
    const isParticipating = announcement.participants.includes(currentUser?.id ?? 0);
    const isParticipationDisabled = isPending || sendingComment;

    const participationButtonText = isPending
        ? 'Заявка отправлена'
        : isParticipating
            ? 'Отказаться от участия'
            : 'Откликнуться';

    const handleToggleParticipation = () => {
        if (!currentUser) {
            Alert.alert('Требуется авторизация', 'Войдите, чтобы присоединиться');
            return;
        }

        if (currentUser.role !== 'volunteer') {
            Alert.alert('Только волонтёры', 'Координаторы не могут участвовать');
            return;
        }

        if (isPending) {
            Alert.alert('Заявка уже отправлена', 'Ожидайте решения координатора');
            return;
        }

        toggleParticipation(announcement.id, currentUser.id);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        if (!currentUser) {
            Alert.alert('Требуется авторизация', 'Войдите, чтобы оставить комментарий');
            return;
        }

        setSendingComment(true);
        try {
            addComment(
                announcement.id,
                commentText.trim(),
                currentUser.name,
                currentUser.id
            );
            setCommentText('');
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось отправить комментарий');
        } finally {
            setSendingComment(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TouchableOpacity style={styles.returnBlock} onPress={() => router.back()}>
                <ReturnIcon width={30} height={30} />
                <Text style={styles.return}>Назад</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{announcement.title}</Text>

            <View style={styles.metaRow}>
                <TouchableOpacity
                    onPress={() => goToProfile(router, announcement.coordinatorId)}
                    activeOpacity={0.7}>
                    <Text style={styles.meta}>
                        Координатор: {announcement.coordinator}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.meta}>
                    Действует до: {announcement.validUntil}
                </Text>
            </View>

            <View style={styles.statusBadge}>
                <Text style={[
                    styles.statusText,
                    announcement.status === 'Активно' && styles.statusActive,
                    announcement.status === 'Выполнено' && styles.statusDone,
                    announcement.status === 'Архив' && styles.statusArchive,
                ]}>
                    {announcement.status}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{announcement.description}</Text>

            <Text style={styles.sectionTitle}>
                Участвуют: {announcement.participants.length} человек
            </Text>

            {currentUser?.role === 'volunteer' && announcement.status === 'Активно' && (
                <TouchableOpacity
                    style={[
                        styles.participationButton,
                        isParticipating ? styles.participationButtonActive : null,
                        isParticipationDisabled && styles.participationButtonDisabled,
                    ]}
                    onPress={handleToggleParticipation}
                    disabled={isParticipationDisabled}
                >
                    <Text style={styles.participationButtonText}>
                        {participationButtonText}
                    </Text>
                </TouchableOpacity>
            )}
            <Text style={styles.sectionTitle}>Комментарии ({announcement.comments.length})</Text>

            {announcement.comments.length === 0 ? (
                <Text style={styles.noComments}>Пока нет комментариев</Text>
            ) : (
                announcement.comments.map(comment => (
                    <View key={comment.id} style={styles.commentItem}>
                        <Text style={styles.commentAuthor}>
                            {comment.author} {comment.authorId === currentUser?.id && '(Вы)'}
                        </Text>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.commentDate}>
                            {new Date(comment.createdAt).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                ))
            )}

            {currentUser && announcement.status !== 'Архив' && announcement.status !== 'Выполнено' && (
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Оставить комментарий..."
                        placeholderTextColor="#999"
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!commentText.trim() || sendingComment) && { opacity: 0.5 },
                        ]}
                        disabled={!commentText.trim() || sendingComment}
                        onPress={handleAddComment}
                    >
                        {sendingComment ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.sendButtonText}>Отправить</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        padding: 20,
        paddingBottom: 100
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        marginTop: 70,
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        marginBottom: 12,
    },
    metaRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    meta: {
        marginBottom: 5,
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        marginBottom: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600'
    },
    statusActive: {
        color: '#4F903F'
    },
    statusDone: {
        color: '#2196F3'
    },
    statusArchive: {
        color: '#757575'
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Roboto-Medium',
        color: '#333',
        marginTop: 24,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    participationButton: {
        marginVertical: 20,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#4F903F',
        alignItems: 'center',
    },
    participationButtonActive: {
        backgroundColor: '#D32F2F',
    },
    participationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
    },
    commentItem: {
        backgroundColor: '#F9F9F9',
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
    },
    commentAuthor: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: '#333',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 15,
        color: '#444',
        marginBottom: 6,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
    },
    noComments: {
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 20,
    },

    commentInputContainer: {
        marginTop: 24,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    commentInput: {
        flex: 1,
        minHeight: 48,
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        padding: 12,
        paddingRight: 50,
        fontSize: 15,
    },
    sendButton: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        backgroundColor: '#4F903F',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
    },
    errorText: {
        fontSize: 18,
        color: '#D32F2F',
        marginBottom: 24,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#4F903F',
        borderRadius: 12,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
    },
    returnBlock: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    return: {
        color: '#4F903F',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginLeft: 8,
    },
    participationButtonDisabled: {
        opacity: 0.5,
    },
});