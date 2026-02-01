import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Announcement, AnnouncementsStore } from '@/types/announcements';
import { initAnnouncements } from '@/data/initAnnouncements';

const preparedAnnouncements = initAnnouncements.map(ann => ({
    ...ann,
    pendingParticipants: ann.pendingParticipants ?? [],
    rejectedParticipants: [],
}));

export const useAnnouncements = create<AnnouncementsStore>()(
    persist(
        (set, get) => ({
            announcements: preparedAnnouncements,

            addAnnouncement: (data) => {
                const newId = Math.max(0, ...get().announcements.map(a => a.id)) + 1;

                const newAnnouncement: Announcement = {
                    ...data,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    comments: [],
                    participants: [],
                    pendingParticipants: [],
                    rejectedParticipants: [],
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

            toggleParticipation: (announcementId: number, volunteerId: number) => {
                set(state => ({
                    announcements: state.announcements.map(ann => {
                        if (ann.id !== announcementId) return ann;

                        const isPending = ann.pendingParticipants.includes(volunteerId);
                        const isApproved = ann.participants.includes(volunteerId);

                        let newPending = [...ann.pendingParticipants];
                        let newParticipants = [...ann.participants];

                        if (isApproved) {
                            newParticipants = newParticipants.filter(id => id !== volunteerId);
                        } else if (isPending) {
                            newPending = newPending.filter(id => id !== volunteerId);
                        } else if (!newPending.includes(volunteerId)) {
                            newPending.push(volunteerId);
                        }

                        return {
                            ...ann,
                            pendingParticipants: newPending,
                            participants: newParticipants,
                        };
                    }),
                }));
            },
            approveParticipation: (announcementId: number, volunteerId: number) => {
                set(state => ({
                    announcements: state.announcements.map(ann => {
                        if (ann.id !== announcementId) return ann;
                        if (!ann.pendingParticipants.includes(volunteerId)) return ann;

                        return {
                            ...ann,
                            pendingParticipants: ann.pendingParticipants.filter(id => id !== volunteerId),
                            participants: [...ann.participants, volunteerId],
                        };
                    }),
                }));
            },

            rejectParticipation: (announcementId: number, volunteerId: number) => {
                set(state => {
                    const newAnnouncements = state.announcements.map(ann => {
                        if (ann.id !== announcementId) return ann;

                        const wasPending = ann.pendingParticipants.includes(volunteerId);

                        if (!wasPending) return ann;

                        return {
                            ...ann,
                            pendingParticipants: ann.pendingParticipants.filter(id => id !== volunteerId),
                            rejectedParticipants: [
                                ...(ann.rejectedParticipants || []),
                                volunteerId
                            ],
                        };
                    });

                    return { announcements: newAnnouncements };
                });
            },
        }),
        {
            name: 'announcements-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                announcements: state.announcements,
            }),
        }
    )
);