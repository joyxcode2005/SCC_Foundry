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
    currentUserId: string | null;
    currentProject: Project | null;
    tasks: Task[];
    isLoadingTasks: boolean;
    taskInterestedUserIds: Record<string, string[]>;

    setUserRole: (role: string | null) => void;
    initializeCurrentUser: () => Promise<void>;
    setCurrentProject: (project: Project | null) => void;
    fetchTasks: () => Promise<void>;
    fetchTaskInterestsForTasks: (taskIds: string[]) => Promise<void>;
    markTaskInterestedByCurrentUser: (taskId: string) => void;
    raiseTaskInterest: (taskId: string) => Promise<boolean>;
}

export interface CreateTaskProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export interface ReviewAssignment {
    id: string;
    task_id: string;
    user_id: string;
    status: string;
    assigned_at: string;
    submission_url: string | null;
    tasks?: {
        title: string;
        category?: string | null;
        points?: number | null;
        drive_folder_url?: string | null;
    } | Array<{
        title: string;
        category?: string | null;
        points?: number | null;
        drive_folder_url?: string | null;
    }>;
}

export interface ReviewUser {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    college_roll: string | null;
}


export interface TrackedRepo {
    id: string;
    project_id: string;
    repo_full_name: string;
}

export interface GitHubMapping {
    user_id: string;
    github_username: string;
}