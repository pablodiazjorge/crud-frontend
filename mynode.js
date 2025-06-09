const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load variables from Vercel (via process.env)
dotenv.config(); // No .env file needed in Vercel

const envFile = `
export const environment = {
  production: true,
  SUPABASE_URL: '${process.env.NG_APP_SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${process.env.NG_APP_SUPABASE_ANON_KEY}',
};
`;

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');
fs.writeFile(targetPath, envFile.trim(), (err) => {
  if (err) {
    console.error('Error writing environment file:', err);
  } else {
    console.log('✅ Successfully generated environment.prod.ts');
  }
});