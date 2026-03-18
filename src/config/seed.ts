import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedModerator() {

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'joysengupta252005@gmail.com',
    password: 'joy.foundry@2005',
    email_confirm: true,
    user_metadata: {
      first_name: 'Joy',
      last_name: 'Sengupta',
      phone: '8777699459',
      middle_name: null,      // Optional
      college_roll: 'CMSM23M182',
      department: 'Computer Science',
      role: 'MODERATOR'       // Must exist in your public.user_role enum
    }
  });

  if (error) {
    console.error('Seed failed:', error.message);
  } else {
    console.log('User created successfully with ID:', data.user.id);
  }
}

seedModerator()