import {View, Text, Image, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
    const router = useRouter();
    const handlePress = () =>{
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
            onPress={handlePress}>
            <View style={{
                flex: 1,
                backgroundColor: '#4F903F',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Image source={require('../assets/images/IconRes.png')} style={{ width: 150, height: 150, marginBottom: 30, }} />
                <Text style={{
                    color: 'white',
                    fontSize: 32,
                    fontFamily: 'Roboto-Bold',
                    textAlign: 'center',
                }}>
                    добро пожаловать в&nbsp;Отлик!
                </Text>
                <Text style={{ position:'absolute', bottom:60, color:'white' }}>
                    нажмите, чтобы продолжить
                </Text>
            </View>
        </TouchableOpacity>
    );
}
