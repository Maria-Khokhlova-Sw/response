import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/stores/userStores';
import { useAnnouncements } from '@/stores/announcementsStores';
import ReturnIcon from '@/assets/images/return.svg';

export default function CreateAnnouncementForm() {
    const { currentUser } = useUserStore();
    const addAnnouncement = useAnnouncements((s) => s.addAnnouncement);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [errors, setErrors] = useState<{ title?: string; description?: string; validUntil?: string }>({});


    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) newErrors.title = 'Введите заголовок объявления';
        if (!description.trim()) newErrors.description = 'Введите описание';
        if (!validUntil.trim()) {
            newErrors.validUntil = 'Укажите дату окончания';
        } else if (!/^\d{4}.\d{2}.\d{2}$/.test(validUntil)) {
            newErrors.validUntil = 'Формат: гггг-мм-дд (например 2026-06-30)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!currentUser || currentUser.role !== 'coordinator') {
            Alert.alert('Ошибка', 'Только координаторы могут создавать объявления');
            return;
        }

        if (!validateForm()) return;

        addAnnouncement({
            title: title.trim(),
            description: description.trim(),
            coordinator: currentUser.name,
            coordinatorId: currentUser.id,
            validUntil,
            status: 'Активно' as const,
            pendingParticipants: [],
            rejectedParticipants: [],
        });

        Alert.alert('Успешно', 'Объявление создано', [
            {
                text: 'OK',
                onPress: () => {
                    setTitle('');
                    setDescription('');
                    setValidUntil('');
                    router.back();
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TouchableOpacity style={styles.returnBlock} onPress={() => router.back()}>
                <ReturnIcon width={30} height={30} />
                <Text style={styles.return}>Назад</Text>
            </TouchableOpacity>

            <Text style={styles.screenTitle}>Создать объявление</Text>

            <View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Заголовок*</Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        placeholder="Краткое описание объявления"
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize="sentences"
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Описание*</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                        placeholder="Подробно опишите, что требуется, когда и где..."
                        multiline
                        numberOfLines={6}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <View style={[styles.inputWrapper, styles.date]}>
                    <Text style={styles.label}>Действует до*</Text>
                    <TextInput
                        style={[styles.input, errors.validUntil && styles.inputError]}
                        placeholder="гггг.мм.дд"
                        value={validUntil}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/\D/g, '').slice(0, 8);
                            let formatted = '';
                            if (cleaned.length > 0) formatted += cleaned.slice(0, 4);
                            if (cleaned.length > 4) formatted += `.${cleaned.slice(4, 6)}`;
                            if (cleaned.length > 6) formatted += `.${cleaned.slice(6, 8)}`;
                            setValidUntil(formatted);
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                    {errors.validUntil && <Text style={styles.errorText}>{errors.validUntil}</Text>}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Создать объявление</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        paddingTop: 90,
        paddingBottom: 40,
    },
    returnBlock: {
        position: 'absolute',
        top: 50,
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
    screenTitle: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: '#333',
        marginBottom: 28,
    },
    inputWrapper: {
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        color: '#444',
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
    inputError: {
        borderColor: '#FF3B30',
        borderWidth: 1.5,
    },
    textArea: {
        minHeight: 105,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    errorText: {
        marginTop: 6,
        color: '#FF3B30',
        fontSize: 13,
    },
    submitButton: {
        marginTop: 16,
        backgroundColor: '#4F903F',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Roboto-Bold',
    },
    date:{
        marginTop:50
    }
});