// // src/services/httpClient.ts

// const BASE_URL = 'https://crm-nicastream.onrender.com';

// export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
//   /** Cuerpo JSON opcional */
//   body?: any;
//   /** Headers adicionales */
//   headers?: Record<string, string>;
// }

// async function httpClient<T = any>(
//   endpoint: string,
//   { method = 'GET', headers = {}, body, ...config }: RequestOptions = {}
// ): Promise<T> {
//   // Asegúrate de que el endpoint empiece con '/'
//   const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//   const url = `${BASE_URL}${normalizedEndpoint}`;

//   const init: RequestInit = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       ...headers,
//     },
//     ...config,
//   };

//   if (body !== undefined) {
//     init.body = JSON.stringify(body);
//   }


// try {
//   const res = await fetch(url, init);




//   const text = await res.text();


//   try {
//   const data = text ? JSON.parse(text) : null;
// } catch (parseError) {
//    // Si la respuesta no es JSON válido
//       throw new Error(`Respuesta no válida JSON: ${parseError}`);
//     }

//   if (!res.ok) {
//     const message = data?.error || data?.message || res.statusText;
//     throw new Error(message);
//   }

//   return data;
// }   catch (error: any) {
//     // Capturar errores de red o los lanzados arriba
//     // Opcional: podrías distinguir error.name === 'TypeError' para red fallida vs custom messages
//     throw new Error(`HTTP Error en ${method} ${url}: ${error.message}`);

//   }
// }


// export default httpClient;

// src/services/httpClient.ts

const BASE_URL = 'https://crm-nicastream.onrender.com';

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  /** Cuerpo JSON opcional */
  body?: any;
  /** Headers adicionales */
  headers?: Record<string, string>;
}

async function httpClient<T = any>(
  endpoint: string,
  { method = 'GET', headers = {}, body, ...config }: RequestOptions = {}
): Promise<T> {
  // Normalizar endpoint
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${normalizedEndpoint}`;

  // Preparar init de fetch
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...config,
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  try {
    // Llamada de red
    const res = await fetch(url, init);

    // Leer texto
    const text = await res.text();

    // Intentar parsear JSON
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseError) {
      // Si la respuesta no es JSON válido
      throw new Error(`Respuesta no válida JSON: ${parseError}`);
    }

    // Si status no OK, lanzar con mensaje del servidor o statusText
    if (!res.ok) {
      const message = data?.error || data?.message || res.statusText;
      throw new Error(`Error ${res.status}: ${message}`);
    }

    // Todo bien, devolvemos los datos
    return data;
  } catch (error: any) {
    // Capturar errores de red o los lanzados arriba
    // Opcional: podrías distinguir error.name === 'TypeError' para red fallida vs custom messages
    throw new Error(`HTTP Error en ${method} ${url}: ${error.message}`);
  }
}

export default httpClient;
