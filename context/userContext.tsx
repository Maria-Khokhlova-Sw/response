import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialUsers } from '@/data/initUsers';
import { User } from '@/types';

type UserStore = {
    currentUser: User | null;
    allUsers: User[];
    isHydrated: boolean;

    register: (newUser: Omit<User, 'id'>) => Promise<boolean>;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    getUserById: (id: number) => User | undefined;
};

export const useUser = create<UserStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            allUsers: initialUsers,
            isHydrated: false,

            register: async (newUserData: Omit<User, 'id'>) => {
                const state = get();
                const phoneExists = state.allUsers.some(u => u.phone === newUserData.phone);

                if (phoneExists) return false;

                const newId = Math.max(...state.allUsers.map(u => u.id), 0) + 1;
                const newUser: User = { ...newUserData, id: newId };

                set(state => ({
                    allUsers: [...state.allUsers, newUser],
                    currentUser: newUser,
                }));

                return true;
            },

            login: async (phone: string, password: string) => {
                const user = get().allUsers.find(u => u.phone === phone && u.password === password);
                if (!user) return false;

                set({ currentUser: user });
                return true;
            },

            logout: async () => {
                set({ currentUser: null });
            },

            getUserById: (id: number) => {
                return get().allUsers.find(u => u.id === id);
            },
        }),

        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                allUsers: state.allUsers,
                currentUser: state.currentUser,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) state.isHydrated = true;
            },
        }
    )
);