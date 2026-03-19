import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "";
const moderatorEmail = import.meta.env.MODERATOR_EMAIL || "";
const moderatorPassword = import.meta.env.MODERATOR_PASSWORD || "";
const moderatorFirstName = import.meta.env.MODERATOR_FIRST_NAME || "";
const moderatorLastName = import.meta.env.MODERATOR_LAST_NAME || "";
const moderatorPhone = import.meta.env.MODERATOR_PHONE || "";
const moderatorCollegeRoll = import.meta.env.MODERATOR_COLLEGE_ROLL || "";
const moderatorDepartment = import.meta.env.MODERATOR_DEPARTMENT || "";

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