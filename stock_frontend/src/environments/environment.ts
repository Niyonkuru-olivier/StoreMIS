declare const process: {
  env: {
    [key: string]: string;
  };
};

export const environment = {
  production: false,
  apiUrl: (window as any).env?.API_URL || 'http://localhost:3001'
};
