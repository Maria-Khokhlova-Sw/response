import { Redirect, router } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useUserStore } from '@/stores/userStores';

export default function Index() {
    const currentUser = useUserStore(state => state.currentUser);
    const isHydrated = useUserStore(state => state.isHydrated);

    if (!isHydrated) {
        return (
            <View style={{ flex: 1, backgroundColor: '#4F903F', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 24 }}>Загрузка...</Text>
            </View>
        );
    }

    if (currentUser) {
        return <Redirect href="/(tabs)/home" />;
    }

    const goToAuth = () => {
      router.replace('/(auth)/login');
    }

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor: '#4F903F',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            activeOpacity={0.8}
            onPress={goToAuth}
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
                    добро пожаловать в Отклик!
                </Text>

                <Text style={{ position: 'absolute', bottom: 60, color: 'white' }}>
                    нажмите, чтобы продолжить
                </Text>
            </View>
        </TouchableOpacity>
    );
}