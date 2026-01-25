import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';

export default function AppLayout() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();

            if (fontsLoaded) {
                await SplashScreen.hideAsync();
                router.replace('/loading');
            }
        }

        prepare();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return <Stack screenOptions={{ headerShown: false }} />;
}
