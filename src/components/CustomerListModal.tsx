// // src/components/CustomerListModal.tsx
// import { useEffect, useState } from 'react';
// import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
// import { useAuth } from '../context/AuthContext';

// interface CustomerListModalProps {
//   username: string;
//   onClose: () => void;
// }

// interface SaleRecord {
//   customer: {
//     id: number;
//     firstName: string;
//     lastName: string;
//   };
// }

// const BACKEND_BASE_URL = 'https://crm-nicastream.onrender.com'; // ✅ URL real

// const CustomerListModal: React.FC<CustomerListModalProps> = ({ username, onClose }) => {
//   const [customers, setCustomers] = useState<SaleRecord['customer'][]>([]);
//   const [loading, setLoading] = useState(true);
//   const { token } = useAuth();

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `${BACKEND_BASE_URL}/customer_products/all-sales?username=${encodeURIComponent(username)}`,
//           {
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//           }
//         );
        
//         if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        
//         const data: SaleRecord[] = await res.json();
//         // ✅ Extraer clientes únicos (evitar duplicados)
//         const uniqueCustomers = Array.from(
//           new Map(data.map(item => [item.customer.id, item.customer])).values()
//         );
        
//         setCustomers(uniqueCustomers);
//       } catch (error) {
//         console.error('Error cargando clientes:', error);
//         setCustomers([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, [username, token]);

//   return (
//     <Modal open onClose={onClose}>
//       <Box sx={{ /* ... estilos existentes ... */ }}>
//         <Typography variant="h6" gutterBottom>
//           Clientes del producto “{username}”
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//             <CircularProgress size={24} />
//           </Box>
//         ) : customers.length > 0 ? (
//           <ul style={{ paddingLeft: 20 }}>
//             {customers.map(c => (
//               <li key={c.id} style={{ marginBottom: 8 }}>
//                 <strong>{c.id}</strong>: {c.firstName} {c.lastName}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <Typography>No se encontraron clientes asociados.</Typography>
//         )}

//         <Box sx={{ textAlign: 'right', mt: 2 }}>
//           <Button variant="contained" onClick={onClose}>
//             Cerrar
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default CustomerListModal;


// src/components/CustomerListModal.tsx
import { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface CustomerListModalProps {
  username: string;
  onClose: () => void;
}

interface SaleRecord {
  customer: {
    id: number;
    firstName: string;
    lastName: string;
  };
  // …otros campos que trae el JSON, pero no los usamos aquí…
}

const BACKEND_BASE_URL = 'https://crm-nicastream.onrender.com';

const CustomerListModal: React.FC<CustomerListModalProps> = ({ username, onClose }) => {
  const [customers, setCustomers] = useState<SaleRecord['customer'][]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/customer_products/all-sales?username=${encodeURIComponent(username)}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {}
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: SaleRecord[] = await res.json();

        // En lugar de filtrar únicos, tomamos todos los customer:
        const allCustomers = data.map(item => item.customer);
        setCustomers(allCustomers);
      } catch (error) {
        console.error('Error cargando clientes:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [username, token]);

  return (
      <Modal 
      open 
      onClose={onClose} 
      sx={{ backdropFilter: 'blur(4px)' }}
    >

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
            bgcolor: 'grey.900',       // Fondo oscuro
          color: 'common.white',     // Texto en blanco
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: '90%',
          maxWidth: 500,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Clientes de: “{username}”
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : customers.length > 0 ? (
          <ul style={{ paddingLeft: 20, marginTop: 16 }}>
            {customers.map((c, idx) => (
            //   <li key={`${c.id}-${idx}`} style={{ marginBottom: 8 }}>
            //     <strong>{c.id}</strong>: {c.firstName} {c.lastName}
            //   </li>

                   <li key={`${c.id}-${idx}`} style={{ marginBottom: 8 }}>
                <a
                  href={`/customers/view/${c.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#4fc3f7', textDecoration: 'none' }}
                >
                  <strong># {c.id}</strong>: {c.firstName} {c.lastName}
                </a>
              </li>


            ))}
          </ul>
        ) : (
          <Typography sx={{ mt: 2 }}>No se encontraron clientes asociados.</Typography>
        )}

        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button variant="contained" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomerListModal;
