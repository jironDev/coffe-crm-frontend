const API_BASE = 'https://crm-nicastream.onrender.com';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  // Lanza un error con el mensaje que venga del backend
 const body = await response.json();
 if (!response.ok) { 
    throw new Error(body.message || JSON.stringify(body));
  }
  return body;
};


export const fetchWorkers = async (token: string) => {
  const response = await fetch(`${API_BASE}/workers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Lanza un error con el mensaje que venga del backend
 const body = await response.json();
 if (!response.ok) { 
    throw new Error(body.message || JSON.stringify(body));
  }
  return body;
};


// Añadir estas funciones al archivo de servicios
export const createWorker = async (token: string, data: any) => {
  const response = await fetch(`${API_BASE}/workers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
 // Lanza un error con el mensaje que venga del backend
 const body = await response.json();
  if (!response.ok) { 
    throw new Error(body.message || JSON.stringify(body));
  }
  return body;
};



export const updateWorker = async (token: string, id: string, data: any) => {
  const response = await fetch(`${API_BASE}/workers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  // Lanza un error con el mensaje que venga del backend
 const body = await response.json();
 if (!response.ok) { 
    throw new Error(body.message || JSON.stringify(body));
  }
  return body;
};


// export const getWorkerById = async (token: string, id: string) => {
//   const response = await fetch(`${API_BASE}/workers/${id}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   // Lanza un error con el mensaje que venga del backend
//  const body = await response.json();
//  if (!response.ok) { 
//     throw new Error(body.message || JSON.stringify(body));
//   }  
//   return body;
// };
