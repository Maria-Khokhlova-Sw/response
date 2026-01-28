import { create } from 'zustand';

export interface Comment {
    id: number;
    author: string;
    authorId?: number;
    text: string;
    createdAt: string;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    coordinator: string;
    coordinatorId: number;
    createdAt: string;
    validUntil: string;
    status: 'Активно' | 'Архив' | 'Черновик' | 'Выполнено';
    comments: Comment[];
    participants: number[];
}

interface Announcements {
    announcements: Announcement[];

    addAnnouncement: (
        data: Omit<Announcement, 'id' | 'comments' | 'participants' | 'createdAt'>
    ) => void;

    addComment: (
        announcementId: number,
        text: string,
        author: string,
        authorId?: number
    ) => void;

    toggleParticipation: (announcementId: number, volunteerId: number) => void;
}

const initialAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Помощь приюту — выгул собак',
        description:
            'Нужны волонтёры для ежедневного выгула собак с 9:00 до 11:00. Адрес: ул. Ленина, 15',
        coordinator: 'Иван Иванов',
        coordinatorId: 1,
        createdAt: new Date().toISOString(),
        validUntil: '2025-06-01',
        status: 'Активно',
        comments: [
            {
                id: 1,
                author: 'Анна Смирнова',
                authorId: 101,
                text: 'Готова помочь! Могу приходить по вторникам и четвергам.',
                createdAt: new Date().toISOString(),
            },
        ],
        participants: [101],
    },
];

export const useAnnouncements = create<Announcements>((set, get) => ({
    announcements: initialAnnouncements,

    addAnnouncement: (data) => {
        const newId = Math.max(0, ...get().announcements.map(a => a.id)) + 1;

        const newAnnouncement: Announcement = {
            ...data,
            id: newId,
            createdAt: new Date().toISOString(),
            comments: [],
            participants: [],
        };

        set(state => ({
            announcements: [...state.announcements, newAnnouncement],
        }));
    },

    addComment: (announcementId, text, author, authorId) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        set(state => ({
            announcements: state.announcements.map(ann =>
                ann.id === announcementId
                    ? {
                        ...ann,
                        comments: [
                            ...ann.comments,
                            {
                                id: Date.now(),
                                author,
                                authorId,
                                text: trimmed,
                                createdAt: new Date().toISOString(),
                            },
                        ],
                    }
                    : ann
            ),
        }));
    },

    toggleParticipation: (announcementId, volunteerId) => {
        set(state => ({
            announcements: state.announcements.map(ann =>
                ann.id === announcementId
                    ? {
                        ...ann,
                        participants: ann.participants.includes(volunteerId)
                            ? ann.participants.filter(id => id !== volunteerId)
                            : [...ann.participants, volunteerId],
                    }
                    : ann
            ),
        }));
    },
}));