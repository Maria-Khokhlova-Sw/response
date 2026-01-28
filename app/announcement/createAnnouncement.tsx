import { useAnnouncements } from '@/context/announcementsContext';
import { useUser } from '@/context/userContext';
import {useState} from "react";
import {Button, TextInput, View} from "react-native";

function CreateAnnouncementForm() {
    const { currentUser } = useUser();
    const addAnnouncement = useAnnouncements(s => s.addAnnouncement);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [validUntil, setValidUntil] = useState('');

    const handleSubmit = () => {
        if (!currentUser || currentUser.role !== 'coordinator') {
            alert('Только координаторы могут создавать объявления');
            return;
        }

        addAnnouncement({
            title,
            description,
            coordinator: currentUser.name,
            coordinatorId: currentUser.id,
            validUntil,
            status: 'Активно',
        });

        setTitle('');
        setDescription('');
        setValidUntil('');
    };

    return (
        <View>
            <TextInput placeholder="Заголовок" value={title} onChangeText={setTitle} />
            <TextInput
                placeholder="Описание"
                multiline
                value={description}
                onChangeText={setDescription}
            />
            <TextInput placeholder="Действует до (гггг-мм-дд)" value={validUntil} onChangeText={setValidUntil} />
            <Button title="Создать объявление" onPress={handleSubmit} />
        </View>
    );
}