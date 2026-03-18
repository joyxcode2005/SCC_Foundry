import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// This forces dotenv to look in the root folder where you run the command
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });;



const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; 
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey ? 'Loaded' : 'Not Loaded');
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  console.log('Starting admin seed process...');

  // Step 1: Create the user in the secure auth.users system
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'joysengupta252005@gmail.com', // Change to your preferred admin email
    password: 'joy.foundry@2005', // Change to a secure password
    email_confirm: true 
  });

  if (authError) {
    console.error('❌ Error creating auth user:', authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log(`✅ Auth user created with ID: ${userId}`);

  // Step 2: Explicitly insert/upsert the row into your public.users table
  const { error: insertError } = await supabaseAdmin
    .from('users')
    .upsert({ 
      id: userId, // This satisfies your foreign key constraint
      first_name: 'Joy',
      last_name: 'Sengupta',
      role: 'ADMIN',
      department: 'Computer Science',
      // created_at and updated_at will default to now() automatically
    });

  if (insertError) {
    console.error('❌ Error inserting into public.users:', insertError.message);
    return;
  }

  console.log('✅ Admin user successfully seeded into public.users table!');
}

seedAdmin();