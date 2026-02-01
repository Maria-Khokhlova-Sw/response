import { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import { useAnnouncements } from '@/stores/announcementsStores';
import ReturnIcon from '@/assets/images/return.svg';
import {goToProfile} from "@/utils/navigation";

export default function Applications() {
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { announcements, approveParticipation, rejectParticipation } = useAnnouncements();

    const pendingApplications = useMemo(() => {
        if (!currentUser?.id) return [];

        return announcements
            .filter(ann => ann.coordinatorId === currentUser.id && ann.pendingParticipants.length > 0)
            .flatMap(ann =>
                ann.pendingParticipants.map(volunteerId => {
                    const volunteer = useUserStore.getState().getUserById(volunteerId);
                    return {
                        announcementId: ann.id,
                        announcementTitle: ann.title,
                        volunteerId,
                        volunteerName: volunteer?.name,
                        volunteer,
                    };
                })
            );
    }, [announcements, currentUser?.id]);

    if (!currentUser || currentUser.role !== 'coordinator') {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Доступно только координаторам</Text>
            </View>
        );
    }

    const handleApprove = (annId: number, volId: number) => {
        Alert.alert(
            'Подтвердить заявку?',
            'Волонтёр будет добавлен в список участников',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Подтвердить',
                    style: 'default',
                    onPress: () => {
                        approveParticipation(annId, volId);
                        Alert.alert('Готово', 'Заявка одобрена');
                    },
                },
            ]
        );
    };

    const handleReject = (annId: number, volId: number) => {
        Alert.alert(
            'Отклонить заявку?',
            'Волонтёр получит отказ',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отклонить',
                    style: 'destructive',
                    onPress: () => {
                        rejectParticipation(annId, volId);
                        Alert.alert('Готово', 'Заявка отклонена');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.returnBlock} onPress={() => router.back()}>
                    <ReturnIcon width={30} height={30} />
                    <Text style={styles.return}>Назад</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Заявки на участие</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {pendingApplications.length === 0 ? (
                    <Text style={styles.emptyText}>Пока нет новых заявок</Text>
                ) : (
                    pendingApplications.map(app => (
                        <View key={`${app.announcementId}-${app.volunteerId}`} style={styles.card}>
                            <Text style={styles.cardTitle}>{app.announcementTitle}</Text>
                            <TouchableOpacity
                                onPress={() => goToProfile(router, app.volunteerId)}
                                activeOpacity={0.7}>
                                <Text style={styles.cardSubtitle}>
                                    Волонтёр: {app.volunteerName}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton]}
                                    onPress={() => handleApprove(app.announcementId, app.volunteerId)}
                                >
                                    <Text style={styles.buttonText}>Подтвердить</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleReject(app.announcementId, app.volunteerId)}
                                >
                                    <Text style={styles.buttonText}>Отклонить</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    returnBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    return: {
        color: '#4F903F',
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        marginLeft: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        textAlign: 'center',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: '#000',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 15,
        color: '#555',
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Roboto-Medium',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 60,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText:{
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    }
});