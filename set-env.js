const fs   = require('fs');
const path = require('path');
require('dotenv').config();

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const makeFile = (target, production) => `export const environment = {
  production: ${production},
  SUPABASE_URL: '${SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}',
};
`;

[
  { file: 'environment.ts',               prod: false },
  { file: 'environment.development.ts',   prod: false },
  { file: 'environment.prod.ts',          prod: true  },
].forEach(({ file, prod }) => {
  const fullPath = path.join(__dirname, 'src', 'environments', file);
  fs.writeFileSync(fullPath, makeFile(fullPath, prod));
  console.log(`📝  Wrote ${file}`);
});