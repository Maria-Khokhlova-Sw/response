import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialUsers } from '@/data/initUsers';
import { User } from '@/types/user';

interface UserStore {
    currentUser: User | null;
    allUsers: User[];
    isHydrated: boolean;

    register: (newUser: Omit<User, 'id'>) => Promise<boolean>;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    getUserById: (id: number) => User | undefined;

    updateUser: (updates: Partial<Omit<User, 'id' | 'role' | 'password'>>) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            allUsers: initialUsers,
            isHydrated: false,

            register: async (newUserData: Omit<User, 'id'>) => {
                const { allUsers } = get();

                if (allUsers.some(u => u.phone === newUserData.phone)) {
                    return false;
                }

                const newId = Math.max(0, ...allUsers.map(u => u.id)) + 1;
                const newUser: User = { ...newUserData, id: newId };

                set(state => ({
                    allUsers: [...state.allUsers, newUser],
                    currentUser: newUser,
                }));

                return true;
            },

            login: async (phone: string, password: string) => {
                const user = get().allUsers.find(
                    u => u.phone === phone && u.password === password
                );

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

            updateUser: (updates: Partial<Omit<User, 'id' | 'role' | 'password'>>) => {
                set(state => {
                    if (!state.currentUser) return state;

                    const updatedCurrent = { ...state.currentUser, ...updates };

                    const updatedAllUsers = state.allUsers.map(u =>
                        u.id === state.currentUser?.id ? updatedCurrent : u
                    );

                    return {
                        currentUser: updatedCurrent,
                        allUsers: updatedAllUsers,
                    };
                });
            },
        }),

        {
            name: 'user-storage',

            storage: createJSONStorage(() => AsyncStorage),

            partialize: state => ({
                currentUser: state.currentUser,
                allUsers: state.allUsers,
            }),

            version: 1,

            migrate: (persistedState: any, version: number) => {
                return persistedState as UserStore;
            },

            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Ошибка гидратации userStore:', error);
                    return;
                }

                if (state) {
                    state.isHydrated = true;
                }
            },
        }
    )
);