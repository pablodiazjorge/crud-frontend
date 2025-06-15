const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config(); // No .env file needed in Vercel

const apiUrl = process.env.NG_APP_API_URL;

if (!apiUrl) {
  throw new Error('Missing required environment variables');
}

const envFile = `
export const environment = {
  production: true,
  API_URL: '${apiUrl}',
};
`;

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.development.ts');
fs.writeFile(targetPath, envFile.trim(), (err) => {
  if (err) {
    console.error('Error writing environment file:', err);
    process.exit(1); // Fail the build if environment file fails
  } else {
    console.log('✅ Successfully generated environment.prod.ts');
  }
});