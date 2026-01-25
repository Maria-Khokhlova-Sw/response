import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReturnIcon from '../../assets/images/return.svg'
import {router} from "expo-router";

export default function fork() {
    const handleVolunteer =() =>{
        router.push('/(auth)/registerVolunteer');
    }
    const handleCoordinator =() =>{
        router.push('/(auth)/registerCoordinator');
    }
    const handleLogin =() =>{
        router.push('/(auth)/login');
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity style={styles.returnBlock} onPress={handleLogin}>
                <ReturnIcon width={30} height={30} />
                <Text style={styles.return}>
                    Назад
                </Text>
            </TouchableOpacity>
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={handleVolunteer}>
                    <Text style={styles.buttonText}>Войти как волонтер</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonCoor} onPress={handleCoordinator}>
                    <Text style={styles.buttonTextCoor}>Войти как координатор</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Roboto-Bold',
        color: '#333333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 48,
    },
    button: {
        height: 52,
        backgroundColor: '#4F903F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:'Roboto-Bold',
    },
    buttonCoor: {
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        borderColor: '#4F903F',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    buttonTextCoor: {
        color: '#4F903F',
        fontSize: 16,
        fontFamily:'Roboto-Bold',
    },
    return:{
        color: '#4F903F',
        fontSize: 20,
        fontFamily:'Roboto-Bold',
    },
    returnBlock:{
        position: 'absolute',
        top: 60,
        left: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    }
});