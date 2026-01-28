import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/userContext';
import EyeClose from "../../assets/images/eye-close.svg"
import Eye from "@/assets/images/eye.svg";

export default function LoginScreen() {
    const router = useRouter();
    const login = useUser(state => state.login);

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const isPhoneValid = phone.length === 18;

    const handleLogin = async () => {
        setError('');

        if (!phone || !password) {
            setError('Заполните номер телефона и пароль');
            return;
        }
        const success = await login(phone, password);
        if (success) {
            router.replace('/(tabs)/home');
        } else {
            setError('Неверный номер телефона или пароль');
        }
    };

    const handleReg =() => {
        router.push('/(auth)/fork');
    }

    const formatPhone = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
        if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
            cleaned = cleaned.slice(1);
        }
        let formatted = '+7';
        if (cleaned.length > 0) formatted += ` (${cleaned.slice(0, 3)}`;
        if (cleaned.length > 3) formatted += `) ${cleaned.slice(3, 6)}`;
        if (cleaned.length > 6) formatted += `-${cleaned.slice(6, 8)}`;
        if (cleaned.length > 8) formatted += `-${cleaned.slice(8, 10)}`;
        return formatted;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.content}>
                    <>
                        <Text style={styles.title}>Вход в Отклик</Text>
                        <Text style={styles.subtitle}>
                            Введите номер телефона и пароль
                        </Text>

                        <View style={styles.form}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Номер телефона</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+7 (___) ___-__-__"
                                    placeholderTextColor="#A9A9A9"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={(text) => setPhone(formatPhone(text))}
                                    maxLength={18}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Пароль</Text>
                                <View style={styles.inputWithIcon}>
                                    <TextInput
                                        style={styles.input}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        contextMenuHidden={true}
                                    />
                                    <TouchableOpacity
                                        onPress={()=> setShowPassword(!showPassword)} style={styles.eyeButton}
                                    >
                                        {showPassword ? <EyeClose width={22} height={22}/> : <Eye width={22} height={22} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (!isPhoneValid || !password) && { opacity: 0.6 },
                                ]}
                                disabled={!isPhoneValid || !password}
                                onPress={handleLogin}>
                                <Text style={styles.buttonText}>Войти</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                </View>
            </KeyboardAvoidingView>
            <View style={styles.footer}>

                <Text style={styles.footerText}>Нет аккаунта? </Text>
                <TouchableOpacity onPress={handleReg}>
                    <Text style={styles.registerLink}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        fontFamily: 'Roboto-Light',
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
    form: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 8,
    },
    input: {
        height: 52,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333333',
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
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 16,
    },
    linkText: {
        color: '#4F903F',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    footerText: {
        color: '#666666',
        fontSize: 15,
    },
    registerLink: {
        color: '#4F903F',
        fontFamily:'Roboto-Bold',
        fontSize: 15,
    },
    inputWithIcon: {
        position: 'relative',
        justifyContent: 'center'
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});