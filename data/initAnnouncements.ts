import { Announcement } from '@/types/announcements';

export const initAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Помощь приюту — выгул собак',
        description:
            'Нужны волонтёры для ежедневного выгула собак с 9:00 до 11:00. Адрес: ул. Ленина, 15. Корм и поводки предоставляем.',
        coordinator: 'Иванов Иван Иванович',
        coordinatorId: 1,
        createdAt: '2026.01.10',
        validUntil: '2026.06.01',
        status: 'Активно',
        comments: [
            {
                id: 6,
                author: 'Софья Андреевна Попова',
                authorId: 8,
                text: 'Могу выгуливать по утрам в будни с 9 до 10:30, живу недалеко. Очень люблю собак ❤️',
                createdAt: '2026-01-13T01:01:00',
            },
            {
                id: 7,
                author: 'Артём Николаевич Ковалёв',
                authorId: 9,
                text: 'Записываюсь на выходные. Беру с собой своего лабрадора, если можно — он хорошо ладит с другими собаками.',
                createdAt: '2026-01-18T12:02:00',
            },
        ],
        participants: [8, 9],
        pendingParticipants: [6],
        rejectedParticipants: [],
    },

    {
        id: 2,
        title: 'Сбор тёплых вещей для бездомных',
        description:
            'Собираем тёплые вещи (куртки, шапки, перчатки, носки, пледы) до 20 января. Пункт приёма: метро Площадь Ленина, выход к ТЦ.',
        coordinator: 'Петров Пётр Петрович',
        coordinatorId: 2,
        createdAt: '2026.01.05',
        validUntil: '2026.03.20',
        status: 'Активно',
        comments: [
            {
                id: 8,
                author: 'Елена Васильевна Васильева',
                authorId: 7,
                text: 'Отдам тёплый плед и детскую зимнюю куртку (размер 128). Можно в субботу днём?',
                createdAt: '2026-01-07T07:02:00',
            },
        ],
        participants: [7],
        pendingParticipants: [5],
        rejectedParticipants: [],
    },

    {
        id: 3,
        title: 'Мастер-класс по изготовлению скворечников',
        description:
            'Приглашаем детей и взрослых на бесплатный мастер-класс. Всё необходимое предоставляем. Дата: 25 января в 14:00. Место: парк "Дубки", беседка №5.',
        coordinator: 'Сидорова Анна Викторовна',
        coordinatorId: 3,
        createdAt: '2026.01.15',
        validUntil: '2026.02.25',
        status: 'Активно',
        comments: [],
        participants: [6],
        pendingParticipants: [9, 7, 5],
        rejectedParticipants: [],
    },

    {
        id: 4,
        title: 'Уборка территории у реки',
        description:
            'Спасибо всем, кто вышел 8 января! Собрали 42 мешка мусора. Следующая акция планируется в марте.',
        coordinator: 'Иванов Иван Иванович',
        coordinatorId: 1,
        createdAt: '2025.12.20',
        validUntil: '2026.01.10',
        status: 'Выполнено',
        comments: [
            {
                id: 4,
                author: 'Дмитрий Александрович Орлов',
                authorId: 6,
                text: 'Было холодно, но очень душевно. Спасибо организаторам!',
                createdAt: '2026-01-09T18:02:00',
            },
        ],
        participants: [6, 4],
        pendingParticipants: [],
        rejectedParticipants: [],
    },

    {
        id: 5,
        title: 'Поиск волонтёров на новогодний утренник в детском доме',
        description:
            'Нужны аниматоры, фотографы, помощники по раздаче подарков. Дата: 28 декабря. Возраст участников от 16 лет.',
        coordinator: 'Иванов Иван Иванович',
        coordinatorId: 1,
        createdAt: '2025.12.01',
        validUntil: '2025.12.27',
        status: 'Архив',
        comments: [
            {
                id: 1,
                author: 'Алексей Максимович Смирнов',
                authorId: 4,
                text: 'Жаль, узнал поздно — очень хотел помочь',
                createdAt: '2024-12-28T15:06:00',
            },
        ],
        participants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
    },
];