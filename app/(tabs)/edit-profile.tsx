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
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore} from '@/stores/userStores';
import ReturnIcon from '@/assets/images/return.svg';
import Eye from '@/assets/images/eye.svg';
import EyeClose from '@/assets/images/eye-close.svg';
import { Picker } from "@react-native-picker/picker";
import {User} from "@/types";

export default function EditProfile() {
    const router = useRouter();
    const currentUser = useUserStore(state => state.currentUser);
    const updateUser = useUserStore(state => state.updateUser);

    if (!currentUser) {
        return (
            <View style={styles.center}>
                <Text>Пользователь не найден</Text>
            </View>
        );
    }
    const [name, setName] = useState(currentUser.name);
    const [phone, setPhone] = useState(currentUser.phone);
    const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
    const [employmentStatus, setEmploymentStatus] = useState(currentUser.employmentStatus || '');
    const [school, setSchool] = useState(currentUser.school || '');
    const [customSchool, setCustomSchool] = useState(currentUser.customSchool || '');
    const [university, setUniversity] = useState(currentUser.university || '');
    const [customUniversity, setCustomUniversity] = useState(currentUser.customUniversity || '');
    const [workPlace, setWorkPlace] = useState(currentUser.workPlace || '');
    const [post, setPost] = useState(currentUser.post || '');

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const phoneError =
        phone === '' ? 'Введите номер телефона' :
            phone.length !== 18 ? 'Некорректный номер' : '';

    const nameError = name.trim() === '' ? 'Введите имя' : '';

    const passwordError =
        newPassword && !/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)
            ? 'Минимум 6 символов, заглавная буква и цифра'
            : newPassword && newPassword !== newPasswordRepeat
                ? 'Пароли не совпадают'
                : '';

    const hasErrors = !!(
        phoneError ||
        nameError ||
        passwordError
    );

    const formatPhone = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
        if (cleaned.startsWith('7') || cleaned.startsWith('8')) cleaned = cleaned.slice(1);
        let formatted = '+7';
        if (cleaned.length > 0) formatted += ` (${cleaned.slice(0, 3)}`;
        if (cleaned.length > 3) formatted += `) ${cleaned.slice(3, 6)}`;
        if (cleaned.length > 6) formatted += `-${cleaned.slice(6, 8)}`;
        if (cleaned.length > 8) formatted += `-${cleaned.slice(8, 10)}`;
        return formatted;
    };

    const handleSave = async () => {
        setSubmitted(true);
        if (hasErrors) return;

        const updatedData: Partial<User> = {
            name: name.trim(),
            phone,
            birthDate: birthDate || undefined,
            employmentStatus: employmentStatus || undefined,
            school: employmentStatus === 'student_school' ? (school === 'custom' ? customSchool : school) || undefined : undefined,
            customSchool: customSchool || undefined,
            university: employmentStatus === 'student_university' ? (university === 'custom' ? customUniversity : university) || undefined : undefined,
            customUniversity: customUniversity || undefined,
            workPlace: employmentStatus === 'working' ? workPlace || undefined : undefined,
            post: post || undefined,
        };

        if (newPassword) {
            Alert.alert('Пароль изменён', 'В будущем добавьте метод changePassword');
        }

        updateUser(updatedData);

        Alert.alert('Успех', 'Профиль обновлён');
        router.back();
    };

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
                    <TouchableOpacity style={styles.returnBlock} onPress={() => router.back()}>
                        <ReturnIcon width={30} height={30} />
                        <Text style={styles.return}>Назад</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Редактировать профиль</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Номер телефона*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+7 (___) ___-__-__"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={text => setPhone(formatPhone(text))}
                            maxLength={18}
                        />
                        {submitted && phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Имя*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Иванов Иван Иванович"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        {submitted && nameError && <Text style={styles.errorText}>{nameError}</Text>}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Дата рождения</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="гггг-мм-дд"
                            value={birthDate}
                            onChangeText={setBirthDate}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Статус занятости</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={employmentStatus}
                                onValueChange={value => {
                                    setEmploymentStatus(value);
                                    setSchool('');
                                    setCustomSchool('');
                                    setUniversity('');
                                    setCustomUniversity('');
                                    setWorkPlace('');
                                }}
                            >
                                <Picker.Item label="Не выбран" value="" />
                                <Picker.Item label="Ученик" value="student_school" />
                                <Picker.Item label="Студент" value="student_university" />
                                <Picker.Item label="Работаю" value="working" />
                                <Picker.Item label="Безработный" value="unemployed" />
                            </Picker>
                        </View>
                    </View>

                    {employmentStatus === 'student_school' && (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Школа</Text>
                            <Picker
                                selectedValue={school}
                                onValueChange={setSchool}
                            >
                                <Picker.Item label="Лицей 137" value="school1" />
                                <Picker.Item label="Гимназия №19" value="school2" />
                                <Picker.Item label="Другое" value="custom" />
                            </Picker>
                            {school === 'custom' && (
                                <TextInput
                                    style={[styles.input, styles.inputCustom]}
                                    placeholder="Название школы"
                                    value={customSchool}
                                    onChangeText={setCustomSchool}
                                />
                            )}
                        </View>
                    )}

                    {employmentStatus === 'student_university' && (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Университет</Text>
                            <Picker
                                selectedValue={university}
                                onValueChange={setUniversity}
                            >
                                <Picker.Item label="Омская Академия..." value="uni1" />
                                <Picker.Item label="Другое" value="custom" />
                            </Picker>
                            {university === 'custom' && (
                                <TextInput
                                    style={[styles.input, styles.inputCustom]}
                                    placeholder="Название университета"
                                    value={customUniversity}
                                    onChangeText={setCustomUniversity}
                                />
                            )}
                        </View>
                    )}

                    {employmentStatus === 'working' && (
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Место работы</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ООО Ромашка"
                                value={workPlace}
                                onChangeText={setWorkPlace}
                            />
                        </View>
                    )}

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Должность</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Социальный работник"
                            value={post}
                            onChangeText={setPost}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Новый пароль (если хотите сменить)</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Оставьте пустым, если не меняете"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeClose width={22} height={22} /> : <Eye width={22} height={22} />}
                            </TouchableOpacity>
                        </View>
                        {submitted && passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Повторите новый пароль</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={!showPasswordRepeat}
                                value={newPasswordRepeat}
                                onChangeText={setNewPasswordRepeat}
                            />
                            <TouchableOpacity onPress={() => setShowPasswordRepeat(!showPasswordRepeat)}>
                                {showPasswordRepeat ? <EyeClose width={22} height={22} /> : <Eye width={22} height={22} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, hasErrors && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={hasErrors}
                    >
                        <Text style={styles.buttonText}>Сохранить изменения</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    returnBlock: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    return: {
        color: '#4F903F',
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        marginLeft: 8,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputWrapper: { marginBottom: 20 },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Roboto-Medium',
    },
    input: {
        height: 52,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    inputCustom: { marginTop: 8 },
    inputWithIcon: { position: 'relative', justifyContent: 'center' },
    eyeButton: {
        position: 'absolute',
        right: 16,
        height: '100%',
        justifyContent: 'center',
    },
    button: {
        height: 52,
        backgroundColor: '#4F903F',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    errorText: {
        marginTop: 6,
        color: '#FF3B30',
        fontSize: 14,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerWrapper:{

    }
});