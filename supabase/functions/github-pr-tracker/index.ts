<<<<<<< HEAD
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const payload = await req.json();
  const eventName = req.headers.get("x-github-event");

  console.log(`Received event: ${eventName}`);

  if (eventName === "pull_request") {
    const { action, pull_request, sender } = payload;
    const githubUsername = pull_request.user.login;
    const prBody = pull_request.body || "";

    console.log(`PR Action: ${action} by ${githubUsername}`);

    // 1. Extract Task ID
    const taskIdMatch = prBody.match(/(?:closes|fixes|resolves) task:\s*([a-f0-9-]+)/i);
    if (!taskIdMatch) {
      console.log("FAILED: No Task ID found in PR body.");
      return new Response("No Task ID found in PR body.", { status: 200 });
    }
    const taskId = taskIdMatch[1];
    console.log(`Extracted Task ID: ${taskId}`);

    // 2. Find User
    const { data: userProfile, error: userError } = await supabase
      .from('user_github_profiles')
      .select('user_id')
      .eq('github_username', githubUsername)
      .single();

    if (userError || !userProfile) {
      console.error("FAILED to find user profile:", userError);
      return new Response("GitHub user not linked.", { status: 200 });
    }
    
    const userId = userProfile.user_id;

    // 3. Handle PR States
    if (action === 'opened' || action === 'reopened') {
      console.log("Attempting to update task to IN_REVIEW...");
      
      const { error: upsertError } = await supabase.from('task_pull_requests').upsert({
        task_id: taskId,
        user_id: userId,
        pr_number: pull_request.number,
        pr_url: pull_request.html_url,
        status: 'open' 
      }, { onConflict: 'task_id,pr_number' });
      
      if (upsertError) console.error("Error inserting PR tracking row:", upsertError);

      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: 'IN_REVIEW', github_pr_url: pull_request.html_url }) // DATABASE MATCH
        .eq('id', taskId);
      
      if (updateError) {
         console.error("CRITICAL ERROR updating tasks table:", updateError);
      } else {
         console.log("SUCCESS: Task updated to IN_REVIEW!");
      }
    } 
    
    else if (action === 'closed' && pull_request.merged) {
      console.log("PR Merged. Updating task to COMPLETED and awarding points...");
      
      const { error: prUpdateError } = await supabase.from('task_pull_requests').update({ status: 'merged' }).eq('task_id', taskId).eq('pr_number', pull_request.number);
      if (prUpdateError) console.error("Error updating PR tracking row:", prUpdateError);
      
      const { error: taskUpdateError } = await supabase.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskId); // DATABASE MATCH
      if (taskUpdateError) console.error("CRITICAL ERROR updating task to COMPLETED:", taskUpdateError);
      
      // Award Points using the RPC
      const { error: rpcError } = await supabase.rpc('award_pr_points', { p_task_id: taskId, p_user_id: userId });
      if (rpcError) {
        console.error("CRITICAL ERROR awarding points:", rpcError);
      } else {
        console.log("SUCCESS: PR Merged, Task Completed, Points Awarded!");
      }
    } 
    
    else if (action === 'closed' && !pull_request.merged) {
      console.log("PR Closed unmerged. Reverting task to OPEN...");
      
      const { error: prUpdateError } = await supabase.from('task_pull_requests').update({ status: 'closed' }).eq('task_id', taskId).eq('pr_number', pull_request.number);
      if (prUpdateError) console.error("Error updating PR tracking row:", prUpdateError);
      
      const { error: taskUpdateError } = await supabase.from('tasks').update({ status: 'OPEN', github_pr_url: null }).eq('id', taskId); // DATABASE MATCH
      if (taskUpdateError) console.error("CRITICAL ERROR reverting task to OPEN:", taskUpdateError);
      else console.log("SUCCESS: PR Closed unmerged, Task reverted to OPEN.");
    }
  }

  return new Response(JSON.stringify({ message: "Webhook processed" }), {
    headers: { "Content-Type": "application/json" },
  });
});
=======
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

serve(async (req: Request) => {
  try {
    // Parse the incoming webhook from GitHub
    const payload = await req.json()

    // We only care if a Pull Request was CLOSED and MERGED
    if (payload.action === 'closed' && payload.pull_request?.merged) {
      
      const repoFullName = payload.repository.full_name; // e.g., "organization/repo-name"
      const githubUsername = payload.pull_request.user.login; // Who made the PR
      
      // Initialize Supabase client with SERVICE_ROLE key (bypasses RLS to safely update points)
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Verify this repo is tracked in our system
      const { data: repo } = await supabase
        .from('tracked_repositories')
        .select('project_id')
        .eq('repo_full_name', repoFullName)
        .single()

      if (!repo) return new Response("Repo not tracked", { status: 200 })

      // Find the dashboard user associated with this GitHub username
      const { data: userProfile } = await supabase
        .from('user_github_profiles')
        .select('user_id')
        .eq('github_username', githubUsername)
        .single()

      if (userProfile) {
        // Award 50 points to the user
        const { error: rpcError } = await supabase.rpc('increment_student_points', {
          target_user_id: userProfile.user_id,
          point_value: 50 
        })

        if (rpcError) throw rpcError;
      }
    }

    // Always return a 200 OK so GitHub knows we received the webhook successfully
    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error) {
    console.error(error)
    return new Response("Internal Server Error", { status: 500 })
  }
})
>>>>>>> 8a68f12908f70254da19d2541cab91381ebac179
