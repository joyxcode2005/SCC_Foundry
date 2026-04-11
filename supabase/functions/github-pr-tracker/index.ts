import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("1. Webhook received! Action:", payload.action);

    // 1. The Event Check
    if (payload.action === 'closed' && payload.pull_request?.merged) {
      console.log("2. PR was merged!");

      const repoFullName = payload.repository.full_name;
      const githubUsername = payload.pull_request.user.login;
      
      console.log(`-> Target Repo: ${repoFullName} | Target User: ${githubUsername}`);

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // 2. The Repo Check
      const { data: repo, error: repoError } = await supabase
        .from('tracked_repositories')
        .select('project_id')
        .eq('repo_full_name', repoFullName)
        .single()

      if (repoError || !repo) {
         console.log("3. FAILED: Repo not found in tracked_repositories table.");
         return new Response("Repo not tracked", { status: 200 })
      }
      console.log("3. Repo verified!");

      // 3. The User Check
      const { data: userProfile, error: userError } = await supabase
        .from('user_github_profiles')
        .select('user_id')
        .eq('github_username', githubUsername)
        .single()

      if (userError || !userProfile) {
          console.log("4. FAILED: GitHub username not found in user_github_profiles table.");
          return new Response("User not mapped", { status: 200 })
      }
      console.log(`4. User verified! Dashboard ID: ${userProfile.user_id}`);

      // 4. The Ledger Update
      console.log("5. Calling increment_student_points function...");
      const { error: rpcError } = await supabase.rpc('increment_student_points', {
        target_user_id: userProfile.user_id,
        point_value: 50
      })

      if (rpcError) {
         console.error("6. FAILED: SQL Function Error:", rpcError);
         throw rpcError;
      }

      console.log("6. SUCCESS: 50 points added to the ledger!");
    } else {
      console.log("Ignored: Not a merged PR event.");
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" }, status: 200 })

  } catch (error) {
    console.error("Fatal Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
})