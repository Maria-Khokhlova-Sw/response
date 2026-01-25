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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Eye from "../../assets/images/eye.svg"
import EyeClose from "../../assets/images/eye-close.svg"
import ReturnIcon from "@/assets/images/return.svg";

export default function RegisterCoordinator() {
    const router = useRouter();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [employmentStatus, setEmploymentStatus] = useState('');
    const [school, setSchool] = useState('');
    const [customSchool, setCustomSchool] = useState('');
    const [university, setUniversity] = useState('');
    const [customUniversity, setCustomUniversity] = useState('');
    const [workPlace, setWorkPlace] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const phoneError =
        phone === ''
            ? 'Введите номер телефона'
            : phone.length < 17
                ? 'Введите корректный номер телефона'
                : '';

    const nameError = name === '' ? 'Введите имя' : '';

    const ageError =
        age === ''
            ? 'Введите возраст'
            : Number(age) < 13 || Number(age) > 100
                ? 'Возраст должен быть от 13 до 100 лет'
                : '';

    const employmentError =
        employmentStatus === '' ? 'Выберите статус занятости' : '';

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
            ageError ||
            employmentError ||
            passwordError
        );

    const handleRegister = () => {
        setSubmitted(true);
        if (hasErrors) return;
        router.replace('/(tabs)/home');
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

                    <Text style={styles.title}>Регистрация волонтера</Text>

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
                        <Text style={styles.label}>Ваш возраст*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="18"
                            value={age}
                            onChangeText={(text) =>
                                setAge(text.replace(/[^0-9]/g, ''))
                            }
                            keyboardType="number-pad"
                            maxLength={3}
                            selectTextOnFocus
                        />
                        {submitted && ageError !== '' && (
                            <Text style={styles.errorText}>{ageError}</Text>
                        )}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Статус занятости*</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={employmentStatus}
                                onValueChange={(value) => {
                                    setEmploymentStatus(value);
                                    setSchool('');
                                    setCustomSchool('');
                                    setUniversity('');
                                    setCustomUniversity('');
                                    setWorkPlace('');
                                }}
                            >
                                <Picker.Item label="Выберите статус" value="" />
                                <Picker.Item label="Ученик" value="student_school" />
                                <Picker.Item label="Студент" value="student_university" />
                                <Picker.Item label="Работаю" value="working" />
                                <Picker.Item label="Безработный" value="unemployed" />
                            </Picker>
                        </View>
                        {submitted && employmentError !== '' && (
                            <Text style={styles.errorText}>{employmentError}</Text>
                        )}

                        {employmentStatus === 'student_school' && (
                            <View style={{marginTop:10}}>
                                <Text style={styles.label}>Выберите школу</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={school}
                                        onValueChange={(value) => setSchool(value)}>
                                        <Picker.Item label="Лицей 137" value="school1" />
                                        <Picker.Item label="Гимназия №19" value="school2" />
                                        <Picker.Item label="Школа №3" value="school3" />
                                        <Picker.Item label="Другое учебное заведение" value="custom" />
                                    </Picker>
                                </View>
                                {school === 'custom' && (
                                    <TextInput
                                        style={styles.inputCustom}
                                        placeholder="Название учебного заведения"
                                        value={customSchool}
                                        onChangeText={setCustomSchool}
                                    />
                                )}
                            </View>
                        )}
                        {employmentStatus === 'student_university' && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.label}>Выберите университет или введите свой</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={university}
                                        onValueChange={(value) => setUniversity(value)}
                                    >
                                        <Picker.Item label="Омская Академия Экономики и Предпринимательства" value="uni1" />
                                        <Picker.Item label="Омский Авиационный колледж" value="uni2" />
                                        <Picker.Item label="Омский аграрный университет" value="uni3" />
                                        <Picker.Item label="Другой" value="custom" />
                                    </Picker>
                                </View>
                                {university === 'custom' && (
                                    <TextInput
                                        style={styles.inputCustom}
                                        placeholder="Название учебного заведения"
                                        value={customUniversity}
                                        onChangeText={setCustomUniversity}
                                    />
                                )}
                            </View>
                        )}
                        {employmentStatus === 'working' && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.label}>Место работы</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Введите место работы"
                                    value={workPlace}
                                    onChangeText={setWorkPlace}
                                />
                            </View>
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
        marginTop: 60,
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
    pickerWrapper: {
        height: 52,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        justifyContent: 'center',
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
    },
    inputCustom:{
        height: 52,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginTop: 16,
    }
});
