import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('Get the service role key from: https://supabase.com/dashboard/project/_/settings/api');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SeedUser = {
  id?: string;
  email: string;
  password: string;
  full_name: string;
  role: 'player' | 'coach' | 'admin';
};

const USERS: SeedUser[] = [
  {
    id: '44e44edc-5484-42d9-9f31-22abe945ccae',
    email: 'demo-jugador@netia.app',
    password: 'netiademo',
    full_name: 'Santiago Morales',
    role: 'player',
  },
  {
    id: '5b20db0d-e111-4e6d-bb98-1d8177b49fe1',
    email: 'demo-entrenador@netia.app',
    password: 'netiademo',
    full_name: 'María Fernández',
    role: 'coach',
  },
  {
    id: '078f89c5-0fb1-4ea7-99c0-6e6ce340c41d',
    email: 'demo-admin@netia.app',
    password: 'netiademo',
    full_name: 'Admin NETIA',
    role: 'admin',
  },
  {
    email: 'test@netia.app',
    password: 'test1234',
    full_name: 'Usuario Test',
    role: 'player',
  },
];

async function listAllUsers() {
  const all: { id: string; email?: string }[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    all.push(...data.users.map((u) => ({ id: u.id, email: u.email })));
    if (data.users.length < 1000) break;
    page++;
  }
  return all;
}

async function main() {
  console.log(`Connecting to ${SUPABASE_URL}...`);
  const existing = await listAllUsers();
  console.log(`Found ${existing.length} existing users in auth.users`);

  for (const u of USERS) {
    const found = existing.find((x) => x.email === u.email);

    if (found) {
      const { error } = await admin.auth.admin.updateUserById(found.id, {
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role: u.role },
      });
      if (error) {
        console.error(`✗ Failed to update ${u.email}: ${error.message}`);
      } else {
        console.log(`✓ Updated ${u.email} (id=${found.id})`);
      }
      continue;
    }

    const { data, error } = await admin.auth.admin.createUser({
      id: u.id,
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, role: u.role },
    });
    if (error) {
      console.error(`✗ Failed to create ${u.email}: ${error.message}`);
    } else {
      console.log(`✓ Created ${u.email} (id=${data.user.id})`);
    }
  }

  console.log('\nDone. The demo accounts can now sign in with password "netiademo".');
  console.log('Test login: test@netia.app / test1234');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
