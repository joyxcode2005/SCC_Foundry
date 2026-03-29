import React, { useState, useEffect } from 'react';
import { supabase } from '../config';

export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'REJECTED'; 

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  assigned_by: string | null;
  status: AssignmentStatus;
  assigned_at: string; 
  completed_at: string | null; 
  submission_url: string | null;
  reviewed_by: string | null;
  tasks?: {
    title: string;
    description?: string;
  };
}

// Removed AssignedTasksProps since we fetch the user session internally

const AssignedTasks: React.FC = () => {
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Define a synchronous useEffect, but put an async function INSIDE it.
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 2. Fetch the user first
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
           setError("Please log in to view your tasks.");
           setIsLoading(false);
           return; // Stop execution if no user
        }

        // 3. Fetch the tasks using the securely retrieved user ID
        const { data, error: dbError } = await supabase
          .from('task_assignments')
          .select('*, tasks(title, description)')
          .eq('user_id', user.id )
          .order('assigned_at', { ascending: false });
        
        // 4. Catch database errors properly
        if (dbError) throw dbError;
        
        // 5. Safely set the data
        setAssignments((data as TaskAssignment[]) || []);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Failed to load assigned tasks.');
      } finally {
        setIsLoading(false);
      }
    };

    // 6. Call the internal async function immediately
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (isLoading) return <div className="p-4 text-gray-500">Loading your tasks...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (assignments.length === 0) return <div className="p-4 text-gray-500">You have no assigned tasks.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Assigned Tasks</h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                
                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {assignment.tasks?.title || `Task ID: ${assignment.task_id}`}
                  </p>
                  <p className="flex items-center text-sm text-gray-500 mt-1">
                    Assigned: {formatDate(assignment.assigned_at)}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      assignment.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {assignment.status}
                  </span>
                  
                  {assignment.submission_url && (
                    <a 
                      href={assignment.submission_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View Submission
                    </a>
                  )}
                </div>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignedTasks;