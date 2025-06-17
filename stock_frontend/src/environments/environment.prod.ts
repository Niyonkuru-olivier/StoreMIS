declare const window: any;

export const environment = {
  production: true,
  apiUrl: window.env?.API_URL_BACKEND1 || 'https://storemis-backend1.onrender.com',
  apiUrl2: window.env?.API_URL_BACKEND2 || 'https://storemis-backend2.onrender.com'
}; 