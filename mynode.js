const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Generate environment.development.ts
const envFile = `
export const environment = {
  SUPABASE_URL: '${process.env.SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY}',
};
`;

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.development.ts');
fs.writeFile(targetPath, envFile.trim(), (err) => {
  if (err) {
    console.error('Error writing environment file:', err);
  } else {
    console.log('✅ Successfully generated environment.development.ts');
  }
});