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
    status: 'Активно' | 'Архив' | 'Выполнено';
    comments: Comment[];
    participants: number[];
    pendingParticipants: number[];
    rejectedParticipants: number[];
}

export interface AnnouncementsStore {
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

    toggleParticipation: (
        announcementId: number,
        volunteerId: number
    ) => void;

    approveParticipation: (
        announcementId: number,
        volunteerId: number
    ) => void;

    rejectParticipation: (
        announcementId: number,
        volunteerId: number
    ) => void;
}