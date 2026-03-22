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
    id: string; // Changed to string because your schema uses UUID
    title: string;
    description: string | null; // Matches 'description' in SQL
    created_by: string | null; // UUID of the user who created it
    drive_url: string | null;
    created_at: string;
    updated_at: string;
    course?: string;
    members?: string[];   // Suggestion: Create a 'project_members' join table later
    progress?: number;    // 0–100
    status?: 'Active' | 'Completed';
    due?: string;         // Suggestion: Add a 'due_date' column to your SQL
    tags?: string[];
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

export interface ProjectCardProps {
    project: any; // Ideally replace 'any' with your Project type
    isCompleted: boolean;
    isModerator: boolean;
    handleEdit: (e: React.MouseEvent, project: any) => void; // Adjust type as needed
    onClick: () => void; // Added onClick for card interaction
    // handleDelete: (e: React.MouseEvent, id: string) => void;
}