const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://car-maintenance-backend.vercel.app';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new APIError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
};


export const recordsAPI = {

  getAll: (): Promise<any[]> => fetchAPI('/records'),

 
  getById: (id: string): Promise<any> => fetchAPI(`/records/${id}`),


  create: (record: any): Promise<any> => 
    fetchAPI('/records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  update: (id: string, record: any): Promise<any> =>
    fetchAPI(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    }),

  delete: (id: string): Promise<void> =>
    fetchAPI(`/records/${id}`, {
      method: 'DELETE',
    }),
};

export const usersAPI = {
  getAll: (): Promise<any[]> => fetchAPI('/users'),
  
  getByEmail: (email: string): Promise<any[]> => fetchAPI(`/users?email=${email}`),
  
  create: (user: any): Promise<any> => 
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
};

export default fetchAPI;