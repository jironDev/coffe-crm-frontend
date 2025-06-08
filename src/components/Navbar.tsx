import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoffeLogo from '../assets/CoffeLogo.png';

export const Navbar = () => {
  const { token, role, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/customers">
          <img
            src={CoffeLogo}
            alt="Coffee CRM Logo"
            width={40}


          /></Link>

        <div className="navbar-nav">
          {token ? (
            <>
              {/* <Link className="nav-link" to="/customers">Clientes</Link> */}

                {token && <Link className="nav-link" to="/products">Productos</Link>}

              {token && <Link className="nav-link" to="/sales">Ventas</Link>}

              {token && <Link className="nav-link" to="/suppliers">Proveedores</Link>}


              {token && <Link className="nav-link" to="/product-prices">Precios</Link>}
              

            

              {token && role === 'ADMIN' && (
                <>
                  <Link className="nav-link" to="/workers">Trabajadores</Link>
                  <Link className="nav-link" to="/admin/exchange-rates">Tasas</Link>
                </>
              )}



              <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link className="nav-link" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
