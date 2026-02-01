import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useUserStore } from '@/stores/userStores'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Eye from "../../assets/images/eye.svg"
import EyeClose from "../../assets/images/eye-close.svg"
import ReturnIcon from "@/assets/images/return.svg";

export default function RegisterCoordinator() {
    const register = useUserStore(state => state.register);

    const router = useRouter();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [name, setName] = useState('');
    const [post, setPost] = useState('');
    const [job, setJob] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const phoneError =
        phone === ''
            ? 'Введите номер телефона'
            : phone.length !== 18
                ? 'Введите корректный номер телефона'
                : '';

    const nameError = name === '' ? 'Введите имя' : '';
    const postError = post === '' ? 'Введите должность' : '';
    const jobError = job === '' ? 'Введите место работы' : '';
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    const passwordError =
        !passwordRegex.test(password)
            ? 'Пароль должен содержать минимум 6 символов, заглавную букву и цифру (только английские буквы)'
            : password !== passwordRepeat
                ? 'Пароли должны совпадать'
                : '';


    const hasErrors =
        !!(
            phoneError ||
            nameError ||
            postError ||
            jobError ||
            passwordError
        );

    const handleRegister = async () => {
        setSubmitted(true);
        if(hasErrors) {
            return;
        }
        const newUser ={
            id: Date.now(),
            name,
            phone,
            password,
            workPlace: job,
            post,
            role: 'coordinator' as const,
        };

        const success = await register(newUser);

        if(success) {
            router.replace('/(tabs)/home');
        } else{
            alert('Пользователь с таким номером уже зарегистрирован')
        }
    };

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
    const handleFork= () =>{
        router.push('/(auth)/fork');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity style={styles.returnBlock} onPress={handleFork}>
                        <ReturnIcon width={30} height={30} />
                        <Text style={styles.return}>
                            Назад
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Регистрация координатора</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Номер телефона*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+7 (___) ___-__-__"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={(text) => setPhone(formatPhone(text))}
                            maxLength={18}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {submitted && phoneError !== '' && (
                            <Text style={styles.errorText}>{phoneError}</Text>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Ваше имя*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Иванов Иван Иванович"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        {submitted && nameError !== '' && (
                            <Text style={styles.errorText}>{nameError}</Text>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Ваша должность*</Text>
                        <TextInput
                            style={styles.input}
                            value={post}
                            onChangeText={setPost}
                            autoCapitalize="words"
                        />
                        {submitted && postError !== '' && (
                            <Text style={styles.errorText}>{postError}</Text>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Место работы*</Text>
                        <TextInput
                            style={styles.input}
                            value={job}
                            onChangeText={setJob}
                            autoCapitalize="words"
                        />
                        {submitted && jobError !== '' && (
                            <Text style={styles.errorText}>{jobError}</Text>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Пароль*</Text>
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

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Повторите пароль*</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPasswordRepeat}
                                value={passwordRepeat}
                                onChangeText={setPasswordRepeat}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="ascii-capable"
                                textContentType="oneTimeCode"
                                contextMenuHidden={true}
                            />
                            <TouchableOpacity
                                onPress={()=> setShowPasswordRepeat(!showPasswordRepeat)} style={styles.eyeButton}
                            >
                                {showPasswordRepeat ? <EyeClose width={22} height={22}/> : <Eye width={22} height={22}/>}
                            </TouchableOpacity>
                        </View>
                        {submitted && passwordError !== '' && (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, submitted && hasErrors && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={submitted && hasErrors}
                    >
                        <Text style={styles.buttonText}>
                            Зарегистрироваться
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'Roboto-Bold',
        color: '#333333',
        marginBottom: 16,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333333',
    },
    input: {
        height: 52,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 42,
        fontSize: 16,
    },
    errorText: {
        marginTop: 6,
        color: '#FF3B30',
        fontSize: 14,
    },
    button: {
        height: 52,
        backgroundColor: '#4F903F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWithIcon: {
        position: 'relative',
        justifyContent: 'center'
    },
    return:{
        color: '#4F903F',
        fontSize: 20,
        fontFamily:'Roboto-Bold',
    },
    returnBlock:{
        position: 'absolute',
        top: 30,
        left: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    }
});
