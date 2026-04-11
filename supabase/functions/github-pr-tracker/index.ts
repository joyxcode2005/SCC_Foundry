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