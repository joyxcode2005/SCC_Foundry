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
    id: string;
    title: string;
    description: string | null;
    created_by: string | null;
    drive_url: string | null;
    created_at: string;
    updated_at: string;
    course?: string;
    members?: string[];
    progress?: number;
    status?: 'Active' | 'Completed';
    due?: string;
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
    id: string;
    title: string;
    description: string | null;
    category: string;
    course?: string;
    due?: string;
    priority?: 'High' | 'Medium' | 'Low';
    status?: 'Pending' | 'In Progress' | 'Completed';
    points: number;
    project_id?: string;
    drive_folder_url?: string | null;
    max_interests?: number;
    deadline?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TaskProps {
    tasks?: Task[];
    loading?: boolean;
}


export type FilterType = 'All' | 'Pending' | 'In Progress' | 'Completed';

export interface ProjectCardProps {
    project: any;
    isCompleted: boolean;
    isModerator: boolean;
    handleEdit: (e: React.MouseEvent, project: any) => void;
    onClick: () => void;
}


export interface ProjectDetailsProps {
    project: any;
    onBack: () => void;
    userRole: string | null;
}

export interface ProjectState {
    userRole: string | null;
    currentProject: Project | null;
    tasks: Task[];
    isLoadingTasks: boolean;

    setUserRole: (role: string | null) => void;
    setCurrentProject: (project: Project | null) => void;
    fetchTasks: () => Promise<void>;
    raiseTaskInterest: (taskId: string) => Promise<void>;
}

export interface CreateTaskProps {
    onSuccess: () => void;
    onCancel: () => void;
}
