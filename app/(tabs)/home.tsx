import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import { useAnnouncements} from '@/stores/announcementsStores';
import Profile from '@/assets/images/profile.svg';
import {goToAnnouncement, goToProfile} from "@/utils/navigation";

export default function Home() {
    const router = useRouter();

    const { currentUser, logout } = useUserStore();
    const { announcements } = useAnnouncements();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {currentUser && (
                    <TouchableOpacity
                        style={styles.profile}
                        onPress={() => goToProfile(router, currentUser.id)}
                    >
                        <Profile width={28} height={28} />
                    </TouchableOpacity>
                )}

                <Text style={styles.headerName}>
                    {currentUser?.name || 'Гость'}
                </Text>

                {currentUser && (
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.logout}>Выйти</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Объявления</Text>

                {announcements.length === 0 ? (
                    <Text style={styles.emptyText}>Пока нет объявлений</Text>
                ) : (
                    announcements.map((ann) => (
                        <TouchableOpacity
                            key={ann.id}
                            style={styles.card}
                            onPress={() => goToAnnouncement(router, ann.id)}
                        >
                            <Text style={styles.cardTitle}>{ann.title}</Text>
                            <Text style={styles.cardText} numberOfLines={2}>
                                {ann.description}
                            </Text>
                            <Text style={styles.cardMeta}>
                                Координатор: {ann.coordinator} · До {ann.validUntil}
                            </Text>
                        </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 70,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    profile: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    headerName: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        flex: 1,
        marginLeft: 12,
    },
    logout: {
        color: '#FF3B30',
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
    },
    content: {
        padding: 16,
        paddingBottom: 90,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginBottom: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        marginBottom: 6,
        color: '#333',
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    cardMeta: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Roboto-Medium',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
});