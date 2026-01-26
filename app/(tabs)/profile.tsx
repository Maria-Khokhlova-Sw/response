import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser} from "@/context/userContext";

export default function Profile() {
    const router = useRouter();
    const { user, logout } = useUser();

    if (!user) return null;

    console.log(user)


    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrapper}>
                <Image
                    source={ require('@/assets/images/default-avatar.png')}
                    style={styles.photo}
                    onLoad={() => console.log('expo-image loaded!')}
                />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.info}>{user.phone}</Text>
            {user.birthDate && (
                <Text style={styles.info}>Дата рождения: {user.birthDate}</Text>
            )}

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push('/(tabs)/edit-profile')}
            >
                <Text style={styles.editButtonText}>Редактировать профиль</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
    },

    avatarWrapper: {
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E5E5',
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
        marginTop: 30,
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
    photo:{
        width: '100%',
        height: 300,
        marginBottom: 15,
    }
});

