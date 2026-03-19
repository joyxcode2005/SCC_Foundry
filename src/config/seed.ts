import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const moderatorEmail = process.env.MODERATOR_EMAIL || "";
const moderatorPassword = process.env.MODERATOR_PASSWORD || "";
const moderatorFirstName = process.env.MODERATOR_FIRST_NAME || "";
const moderatorLastName = process.env.MODERATOR_LAST_NAME || "";
const moderatorPhone = process.env.MODERATOR_PHONE || "";
const moderatorCollegeRoll = process.env.MODERATOR_COLLEGE_ROLL || "";
const moderatorDepartment = process.env.MODERATOR_DEPARTMENT || "";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedModerator() {

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: moderatorEmail,
    password: moderatorPassword,
    email_confirm: true,
    user_metadata: {
      first_name: moderatorFirstName,
      last_name: moderatorLastName,
      phone: moderatorPhone,
      middle_name: null,      // Optional
      college_roll: moderatorCollegeRoll,
      department: moderatorDepartment,
      role: 'MODERATOR'    
    }
  });

  if (error) {
    console.error('Seed failed:', error.message);
  } else {
    console.log('User created successfully with ID:', data.user.id);
  }
}

seedModerator()