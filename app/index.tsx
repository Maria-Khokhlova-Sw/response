import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/userContext';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
    const { currentUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.replace('/(tabs)/home');
        }
    }, [currentUser]);

    const handlePress = () => {
        if (!currentUser) {
            router.replace('/(auth)/login');
        }
    };

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor: '#4F903F',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../assets/images/IconRes.png')}
                    style={{ width: 150, height: 150, marginBottom: 30 }}
                />
                <Text
                    style={{
                        color: 'white',
                        fontSize: 32,
                        fontFamily: 'Roboto-Bold',
                        textAlign: 'center',
                    }}
                >
                    добро пожаловать в&nbsp;Отлик!
                </Text>
                {!currentUser && (
                    <Text style={{ position: 'absolute', bottom: 60, color: 'white' }}>
                        нажмите, чтобы продолжить
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
