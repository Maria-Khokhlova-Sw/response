import { Stack } from 'expo-router';
import { UserProvider } from '@/context/userContext';

export default function AppLayout() {
    return (
        <UserProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </UserProvider>
    );
}
