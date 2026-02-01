import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import ReturnIcon from "@/assets/images/return.svg";
import {formatEmploymentStatus} from '@/utils/formatEmploymentStatus';
import {formatDate} from "@/utils/formateDate";

export default function Profile() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const currentUser = useUserStore((state) => state.currentUser);
    const getUserById = useUserStore((state) => state.getUserById);
    const logout = useUserStore((state) => state.logout);

    if (!currentUser) return null;

    const profileUser =getUserById(Number(id));
    if (!profileUser) return null;

    const isOwner = currentUser?.id === profileUser.id;

    const handleHome= () =>{
        router.push('/home');
    }

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.returnBlock} onPress={handleHome}>
                <ReturnIcon width={30} height={30} />
                <Text style={styles.return}>
                    Назад
                </Text>
            </TouchableOpacity>

            <Text style={styles.name}>{profileUser.name}</Text>
            <Text style={styles.info}>{profileUser.phone}</Text>

            {profileUser.role === 'volunteer' && (
                <>
                    {profileUser.birthDate && (
                        <Text style={styles.info}>
                            Дата рождения: {formatDate(profileUser.birthDate)}
                        </Text>
                    )}

                    {profileUser.employmentStatus && profileUser.employmentStatus !== 'unemployed' && (
                        <Text style={styles.info}>
                            Род деятельности: {formatEmploymentStatus(profileUser.employmentStatus)}
                        </Text>
                    )}

                    {profileUser.university && (
                        <Text style={styles.info}>
                            Университет: {profileUser.university}
                        </Text>
                    )}

                    {profileUser.school && (
                        <Text style={styles.info}>
                            Школа: {profileUser.school}
                        </Text>
                    )}

                    {profileUser.workPlace && profileUser.employmentStatus === 'working' && (
                        <Text style={styles.info}>
                            Место работы: {profileUser.workPlace}
                        </Text>
                    )}
                </>
            )}

            {profileUser.role === 'coordinator' && (
                <>
                    {profileUser.post && (
                        <Text style={styles.info}>
                            Должность: {profileUser.post}
                        </Text>
                    )}

                    {profileUser.workPlace && (
                        <Text style={styles.info}>
                            Место работы / организация: {profileUser.workPlace}
                        </Text>
                    )}
                </>
            )}

            {currentUser.role === "coordinator" && isOwner &&(
                <TouchableOpacity
                    style={styles.corButton}
                    onPress={() => router.push('/(tabs)/applications')}
                >
                    <Text style={styles.corButtonText}>
                        Заявки
                    </Text>
                </TouchableOpacity>
            )}

            {currentUser.role === "volunteer" && isOwner && (
                <TouchableOpacity
                    style={styles.corButton}
                    onPress={() => router.push('/(tabs)/responses')}
                >
                    <Text style={styles.corButtonText}>
                        Мои отклики
                    </Text>
                </TouchableOpacity>
            )}

            {isOwner && (
                <>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push('/(tabs)/edit-profile')}
                    >
                        <Text style={styles.editButtonText}>
                            Редактировать профиль
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Выйти</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 200,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    info: {
        fontSize: 15,
        color: '#666',
        marginBottom: 6,
        textAlign: 'center',
    },
    editButton: {
        marginTop: 50,
        width: '100%',
        height: 52,
        backgroundColor: '#4F903F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    corButton: {
        marginTop: 50,
        width: '100%',
        height: 52,
        borderWidth: 1,
        borderColor: '#4F903F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corButtonText: {
        color: '#4F903F',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    logoutButton: {
        marginTop: 16,
        width: '100%',
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    return:{
        color: '#4F903F',
        fontSize: 20,
        fontFamily:'Roboto-Bold',
    },
    returnBlock:{
        position: 'absolute',
        top: 60,
        left: 25,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        zIndex: 10000,
    },
});

