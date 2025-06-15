const fs   = require('fs');
const path = require('path');

require('dotenv').config({ path: './src/.env' });
require('dotenv').config();

const API_URL     = process.env.NG_APP_API_URL     || process.env.API_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Faltan NG_APP_SUPABASE_URL o NG_APP_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const makeEnv = (production) => `export const environment = {
  production: ${production},
  API_URL: '${API_URL}',
};
`;

const envDir = path.join(__dirname, 'src', 'environments');
const files = [
  { name: 'environment.ts',     prod: false },
  { name: 'environment.development.ts', prod: true  }
];

files.forEach(({ name, prod }) => {
  const filePath = path.join(envDir, name);
  fs.writeFileSync(filePath, makeEnv(prod));
  console.log(`📝 Generado ${filePath}`);
});