import { create } from 'zustand';
import { Announcement, AnnouncementsStore } from '@/types/announcements';
import { initAnnouncements } from '@/data/initAnnouncements';

export const useAnnouncements = create<AnnouncementsStore>((set, get) => ({
    announcements: initAnnouncements,

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