import { User } from '@/types';

export const initialCoordinators: User[] = [
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
    },
];

export const initialVolunteers: User[] = [
    {
        id: 4,
        name: "Алексей Максимович Смирнов",
        phone: "+7 (901) 234-56-78",
        password: "Volunteer1",
        birthDate: "2006-05-15",
        employmentStatus: "student_university",
        university: "Омская Академия Экономики и Предпринимательства",
        role: 'volunteer',
    },
    {
        id: 5,
        name: "Мария Сергеевна Кузнецова",
        phone: "+7 (905) 678-90-12",
        password: "MariaV123",
        birthDate: "2009-12-27",
        employmentStatus: "student_school",
        school: "Гимназия №19",
        role: 'volunteer',
    },
    {
        id: 6,
        name: "Дмитрий Александрович Орлов",
        phone: "+7 (912) 111-22-33",
        password: "Dmitry01",
        birthDate: "2001-01-01",
        employmentStatus: "working",
        workPlace: "ООО СервисПлюс",
        role: 'volunteer',
    },
    {

        id: 7,
        name: "Елена Васильевна Васильева",
        phone: "+7 (913) 444-55-66",
        password: "ElenaV123",
        birthDate: "2004-05-15",
        employmentStatus: "unemployed",
        role: 'volunteer',
    },
];

export const initialUsers = [...initialCoordinators, ...initialVolunteers];