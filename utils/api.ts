// Configuración de la API
export const API_CONFIG = {
  // Cambiar según el entorno
  BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://tu-dominio.com/api',
  
  // Timeouts
  TIMEOUT: 10000, // 10 segundos
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Función helper para hacer requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    credentials: 'include', // Importante para cookies de sesión
  };

  return fetch(url, config);
};

// Función helper para manejar respuestas de la API
export const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }
  
  return data;
};
