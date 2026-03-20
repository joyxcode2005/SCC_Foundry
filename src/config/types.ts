export interface Student {
    rank: number;
    name: string;
    roll: string;
    department: string;
    points: number;
    isYou?: boolean;
}

export interface Props {
    students?: Student[];
    loading?: boolean;
}

export interface UserProfile {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    college_roll: string;
    department: string;
    role: string;
    email: string;
}

export interface Project {
    id: number | string;
    title: string;
    course: string;
    desc: string;
    members: string[];   // initials or names
    progress: number;    // 0–100
    status: 'Active' | 'Completed';
    due: string;
    tags: string[];
}


export interface ProjectProps {
    projects?: Project[];
    loading?: boolean;
}

export interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    customClass?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Task {
  id: number | string;
  title: string;
  course: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  points: number;
}

export interface TaskProps {
  tasks?: Task[];
  loading?: boolean;
}


export type FilterType = 'All' | 'Pending' | 'In Progress' | 'Completed';