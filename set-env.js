// set-env.js
const fs   = require('fs');
const path = require('path');

require('dotenv').config({ path: './src/.env' });
require('dotenv').config();

const SUPABASE_URL     = process.env.NG_APP_SUPABASE_URL     || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NG_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Faltan NG_APP_SUPABASE_URL o NG_APP_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const makeEnv = (production) => `export const environment = {
  production: ${production},
  SUPABASE_URL: '${SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}',
};
`;

const envDir = path.join(__dirname, 'src', 'environments');
const files = [
  { name: 'environment.ts',     prod: false },
  { name: 'environment.prod.ts', prod: true  }
];

files.forEach(({ name, prod }) => {
  const filePath = path.join(envDir, name);
  fs.writeFileSync(filePath, makeEnv(prod));
  console.log(`📝 Generado ${filePath}`);
});
