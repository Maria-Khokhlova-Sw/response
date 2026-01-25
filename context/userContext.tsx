import React, {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
type User = {
    id: number;
    name: string;
    phone: string;
    password: string;
    birthDate?: string;
    employmentStatus?: string;
    school?: string;
    customSchool?: string;
    university?: string;
    customUniversity?: string;
    workPlace?: string;
    post?: string;
    role: 'coordinator' | 'volunteer';
};

const initialCoordinators: User[] = [
    {
        id: 1,
        name: "Иванов Иван Иванович",
        phone: "+7 (912) 345-67-89",
        password: "Password1",
        workPlace: "ООО Ромашка",
        post: "Владелец приюта для животных",
        role: 'coordinator',
    },
    {
        id: 2,
        name: "Петров Пётр Петрович",
        phone: "+7 (900) 123-45-67",
        password: "Coord2026",
        workPlace: "ООО Василек",
        post: "Координатор мероприятий",
        role: 'coordinator',
    },
    {
        id: 3,
        name: "Сидорова Анна Викторовна",
        phone: "+7 (913) 987-65-43",
        password: "Anna123",
        workPlace: "Социальный центр",
        post: "Социальный работник",
        role: 'coordinator',
    }
];
const initialVolunteers: User[] = [
    {
        id: 1,
        name: "Алексей Максимович Смирнов",
        phone: "+7 (901) 234-56-78",
        password: "Volunteer1",
        birthDate: "2006-05-15",
        employmentStatus: "student_university",
        university: "Омская Академия Экономики и Предпринимательства",
        role: 'volunteer',
    },
    {
        id: 2,
        name: "Мария Сергеевна Кузнецова",
        phone: "+7 (905) 678-90-12",
        password: "MariaV123",
        birthDate: "2009-12-27",
        employmentStatus: "student_school",
        school: "Гимназия №19",
        role: 'volunteer',
    },
    {
        id: 3,
        name: "Дмитрий Александрович Орлов",
        phone: "+7 (912) 111-22-33",
        password: "Dmitry01",
        birthDate: "2001-01-01",
        employmentStatus: "working",
        workPlace: "ООО СервисПлюс",
        role: 'volunteer',
    },
    {
        id: 4,
        name: "Елена Васильевна Васильева",
        phone: "+7 (913) 444-55-66",
        password: "ElenaV123",
        birthDate: "2004-05-15",
        employmentStatus: "unemployed",
        role: 'volunteer',
    },
];

type UserContextType = {
    user: User | null;
    register: (newUser: User) => Promise<boolean>;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [usersList, setUsersList] = useState<User[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedUsers = await AsyncStorage.getItem("@userList");
                const storedUser = await AsyncStorage.getItem("@currentUser");

                if (storedUsers) {
                    setUsersList(JSON.parse(storedUsers));
                } else {
                    const initialUsers = [...initialCoordinators, ...initialVolunteers];
                    setUsersList(initialUsers);
                    await AsyncStorage.setItem('@userList', JSON.stringify(initialUsers));
                }

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Ошибка загрузки данных пользователя', e);
            }
        };
        loadData();
    }, []);

    const register = async (newUser: User) => {
        const exists = usersList.some(user =>user.phone === newUser.phone);
        if(exists){
            return false;
        }
        const updatedUsers = [...usersList, newUser];
        setUsersList(updatedUsers);
        setUser(newUser);

        await AsyncStorage.setItem("@userList", JSON.stringify(updatedUsers));
        await AsyncStorage.setItem('@currentUser', JSON.stringify(newUser));
        return true;
    }

    const login = async (phone: string, password: string) => {
        const found = usersList.find(user => user.phone === phone && user.password === password);
        if(!found){
            return false;
        }
        setUser(found);
        await AsyncStorage.setItem("@currentUser", JSON.stringify(found));
        return true;
    }

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem("@currentUser");
    };

    return (
        <UserContext.Provider value={{ user, register, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser должен использоваться внутри UserProvider');
    return context;
};
