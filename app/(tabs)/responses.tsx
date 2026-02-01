import { useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import { useAnnouncements} from '@/stores/announcementsStores';
import ReturnIcon from '@/assets/images/return.svg';

export function goToAnnouncement(router: any, id: number | string) {
    router.push({
        pathname: '/announcement/[id]',
        params: { id: String(id) },
    });
}

type ApplicationStatus = 'pending' | 'approved'  | 'rejected';
interface MyApplication {
    announcementId: number;
    title: string;
    status: ApplicationStatus;
}

export default function MyResponses() {
    const router = useRouter();
    const currentUser = useUserStore((state) => state.currentUser);
    const { announcements } = useAnnouncements();

    const applications = useMemo<MyApplication[]>(() => {
        const userId = currentUser?.id;
        if (!userId) return [];

        const list: MyApplication[] = [];

        announcements.forEach((ann) => {
            if (ann.pendingParticipants.includes(userId)) {
                list.push({ announcementId: ann.id, title: ann.title, status: 'pending' });
            }
            if (ann.participants.includes(userId)) {
                list.push({ announcementId: ann.id, title: ann.title, status: 'approved' });
            }
            if (ann.rejectedParticipants?.includes(userId)) {
                list.push({ announcementId: ann.id, title: ann.title, status: 'rejected' });
            }
        });

        list.sort((a, b) => {
            const order = { pending: 0, approved: 1, rejected: 2 };
            return order[a.status] - order[b.status];
        });

        return list;
    }, [announcements, currentUser?.id]);

    if (!currentUser || currentUser.role !== 'volunteer') {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>Доступно только волонтёрам</Text>
            </View>
        );
    }

    const getStatusInfo = (status: ApplicationStatus) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Ожидает решения',
                    textColor: '#4F903F',
                    bgColor: '#e1eddd',
                };
            case 'approved':
                return {
                    label: 'Подтверждено',
                    textColor: '#fff',
                    bgColor: '#4F903F',
                };
            case 'rejected':
               return {
                   label: 'Отклонено',
                   textColor: '#F44336',
                   bgColor: '#fee2e2'
               };
            default:
                return {
                    label: '—',
                    textColor: '#4b5563',
                    bgColor: '#f3f4f6',
                };
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.returnBlock} onPress={() => router.back()}>
                    <ReturnIcon width={28} height={28} />
                    <Text style={styles.returnText}>Назад</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Мои отклики</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {applications.length === 0 ? (
                    <Text style={styles.empty}>У вас пока нет откликов</Text>
                ) : (
                    applications.map((app) => {
                        const { label, textColor, bgColor } = getStatusInfo(app.status);

                        return (
                            <TouchableOpacity
                                key={app.announcementId}
                                style={styles.card}
                                onPress={() => goToAnnouncement(router, app.announcementId)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cardTitle}>{app.title}</Text>

                                <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                                    <Text style={[styles.statusText, { color: textColor }]}>
                                        {label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    returnBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    returnText: {
        color: '#4F903F',
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#111827',
        textAlign: 'center',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: '#111827',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    empty: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 16,
        marginTop: 60,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    error: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
    },
});