import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import { useAnnouncements } from '@/stores/announcementsStores';
import Profile from '@/assets/images/profile.svg';
import { goCreateAnnouncement, goToAnnouncement, goToProfile } from "@/utils/navigation";
import { Announcement } from '@/types/announcements';

type FilterType = 'active' | 'my' | 'completed' | 'archived' | 'all';

export default function Home() {
    const router = useRouter();

    const { currentUser } = useUserStore();
    const { announcements } = useAnnouncements();

    const [activeFilter, setActiveFilter] = useState<FilterType>('active');

    const isActiveAndValid = (ann: Announcement) => {
        if (ann.status !== 'Активно') return false;
        try {
            const [y, m, d] = ann.validUntil.split('.').map(Number);
            const until = new Date(y, m - 1, d);
            return until >= new Date();
        } catch {
            return false;
        }
    };

    const filteredAnnouncements = announcements.filter((ann) => {
        if (activeFilter === 'my') {
            return ann.coordinatorId === currentUser?.id;
        }
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return isActiveAndValid(ann);
        if (activeFilter === 'completed') return ann.status === 'Выполнено';
        if (activeFilter === 'archived') {
            return ann.status === 'Архив' || (ann.status === 'Активно' && !isActiveAndValid(ann));
        }
        return false;
    });

    const getFilterLabel = (filter: FilterType) => {
        switch (filter) {
            case 'active':    return 'Активные';
            case 'my':        return 'Мои объявления';
            case 'completed': return 'Выполнено';
            case 'archived':  return 'Архив';
            case 'all':       return 'Все';
            default:          return 'Активные';
        }
    };

    const isCoordinator = currentUser?.role === 'coordinator';

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Активно':   return styles.statusActive;
            case 'Выполнено': return styles.statusCompleted;
            default:          return styles.statusArchived;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {currentUser && (
                    <TouchableOpacity
                        style={styles.profileHeader}
                        onPress={() => goToProfile(router, currentUser.id)}
                    >
                        <Profile width={28} height={28} />
                        <Text style={styles.headerName}>
                            {currentUser?.name || 'Гость'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {isCoordinator && (
                        <TouchableOpacity
                            key="my"
                            style={[
                                styles.filterButton,
                                activeFilter === 'my' && styles.filterButtonActive,
                            ]}
                            onPress={() => setActiveFilter('my')}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === 'my' && styles.filterButtonTextActive,
                                ]}
                            >
                                {getFilterLabel('my')}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {(['active', 'completed', 'archived', 'all'] as FilterType[]).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterButton,
                                activeFilter === filter && styles.filterButtonActive,
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    activeFilter === filter && styles.filterButtonTextActive,
                                ]}
                            >
                                {getFilterLabel(filter)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>
                    {activeFilter === 'my'
                        ? 'Мои объявления'
                        : 'Объявления'}
                </Text>

                {filteredAnnouncements.length === 0 ? (
                    <Text style={styles.emptyText}>
                        {activeFilter === 'all'
                            ? 'Пока нет объявлений'
                            : activeFilter === 'my'
                                ? 'У вас ещё нет созданных объявлений'
                                : `Нет объявлений в категории «${getFilterLabel(activeFilter)}»`}
                    </Text>
                ) : (
                    [...filteredAnnouncements]
                        .filter(ann => typeof ann === 'object' && ann !== null && ann.id != null)
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map(ann => (
                            <TouchableOpacity
                                key={String(ann.id)}
                                style={styles.card}
                                onPress={() => goToAnnouncement(router, ann.id)}
                            >
                                <Text style={styles.cardTitle}>{ann.title || 'Без названия'}</Text>
                                <Text style={styles.cardText} numberOfLines={2}>
                                    {ann.description || 'Нет описания'}
                                </Text>
                                <Text style={[styles.cardStatus, getStatusStyle(ann.status || 'Архив')]}>
                                    {ann.status || 'Неизвестно'}
                                </Text>
                            </TouchableOpacity>
                        ))
                )}
            </ScrollView>

            {currentUser?.role === "coordinator" && (
                <TouchableOpacity onPress={() => goCreateAnnouncement(router, currentUser.id)}>
                    <View style={styles.createAnn}>
                        <Text style={styles.createAnnText}>+</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        marginTop: 15,
        paddingTop: 25,
        height: 70,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerName: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        flex: 1,
        marginLeft: 12,
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
        color: '#000000',
    },
    cardText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    filterWrapper: {
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        paddingRight: 32,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 12,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#4F903F',
    },
    filterButtonText: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
        color: '#555',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    cardStatus: {
        fontSize: 13,
        fontFamily: 'Roboto-Medium',
    },
    statusActive: {
        color: '#4F903F',
    },
    statusCompleted: {
        color: '#2196F3',
    },
    statusArchived: {
        color: '#9E9E9E',
    },
    createAnn: {
        backgroundColor: '#4F903F',
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        bottom: 60,
        right: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAnnText: {
        color: '#FFF',
        fontSize: 35,
    }
});