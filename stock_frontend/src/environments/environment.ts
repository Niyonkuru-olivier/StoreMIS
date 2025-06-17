export const environment = {
  production: false,
  apiUrl: process.env['API_URL'] || 'http://localhost:3001' // Use environment variable or fallback to localhost
};
