export function formatEmploymentStatus(status: string){
    switch (status) {
        case 'student_university':
            return 'Студент';
        case 'student_school':
            return 'Школьник';
        case 'working':
            return 'Работник';
        case 'unemployed':
            return '';
        default:
            return status;
    }
};