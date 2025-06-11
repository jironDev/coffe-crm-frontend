// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { login } from '../services/api.ts';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { login: authLogin } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { token } = await login(email, password);
//       authLogin(token);
//       navigate('/customers');
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <div className="container py-4 mt-5 login-wrapper">
     
//       <div className="d-flex flex-column align-items-center mb-3">
//         <img
//           src="/CoffeLogo.png"
//           alt="Coffee CRM Logo"
//           width={100}
//           height="auto"
//           className="mb-3"
//         />
//         <h1 className="h1 american-typewriter">Coffee CRM</h1>
//       </div>

// <hr className="mb-4"/>

      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             autoFocus
//           />
//         </div>
//         <div className="mb-4">
//           <input
//             type="password"
//             className="form-control"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit" className="btn btn-primary w-100 w-md-auto">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Login; // Exportación añadida

// src/pages/Login.tsx  2da version
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api.ts';
import CoffeLogo from '../assets/CoffeLogo.png'; // Asegúrate de que la ruta es correcta


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);          // ← nuevo
  const [error, setError] = useState<string | null>(null); // opcional feedback
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await login(email, password);
      authLogin(token);
      navigate('/customers');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Error de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 mt-5 login-wrapper">
      <div className="d-flex flex-column align-items-center mb-3">
        {/* Usa la opción A o B para que esto cargue */}
        {/* <img src="/src/assets/CoffeLogo.png" alt="Coffee CRM Logo" width={100} className="mb-3" /> */}
         <img src={CoffeLogo} alt="Coffee CRM Logo" width={100} className="mb-3" />
        <h1 className="h1 american-typewriter">Coffee CRM</h1>
      </div>
      <hr className="mb-4" />

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 w-md-auto"
          disabled={loading}
        >
          {loading
            ? <><CircularProgress size={20} color="inherit" /></>
            : 'Login'
          }
        </button>
      </form>
    </div>
  );
};

export default Login;
