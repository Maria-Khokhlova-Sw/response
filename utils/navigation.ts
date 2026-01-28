import { Router } from 'expo-router';

export function goToProfile(router: Router, userId: number | string) {
    router.push({
        pathname: '/profile/[id]',
        params: { id: String(userId) },
    });
}

export function goToAnnouncement(router: Router, announcementId: number | string) {
    router.push({
        pathname: '/announcement/[id]',
        params: { id: String(announcementId) },
    });
}