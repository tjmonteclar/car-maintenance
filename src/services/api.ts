const API_BASE_URL = 'http://localhost:3001';

// Generic API error handler
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
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

// Records API
export const recordsAPI = {
  // Get all records
  getAll: (): Promise<any[]> => fetchAPI('/records'),

  // Get record by ID
  getById: (id: number): Promise<any> => fetchAPI(`/records/${id}`),

  // Create new record
  create: (record: any): Promise<any> => 
    fetchAPI('/records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  // Update record
  update: (id: number, record: any): Promise<any> =>
    fetchAPI(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    }),

  // Delete record
  delete: (id: number): Promise<void> =>
    fetchAPI(`/records/${id}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersAPI = {
  getAll: (): Promise<any[]> => fetchAPI('/users'),
  create: (user: any): Promise<any> => 
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
};

export default fetchAPI;