// mynode.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config(); // No .env file needed in Vercel

const supabaseUrl = process.env.NG_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.NG_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables');
}

const envFile = `
export const environment = {
  production: true,
  SUPABASE_URL: '${supabaseUrl}',
  SUPABASE_ANON_KEY: '${supabaseAnonKey}',
};
`;

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');
fs.writeFile(targetPath, envFile.trim(), (err) => {
  if (err) {
    console.error('Error writing environment file:', err);
    process.exit(1); // Fail the build if environment file fails
  } else {
    console.log('✅ Successfully generated environment.prod.ts');
  }
});