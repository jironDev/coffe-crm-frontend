// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import CoffeLogo from '../assets/CoffeLogo.png';

// export const Navbar = () => {
//   const { token, role, logout } = useAuth();

//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/customers">
//           <img
//             src={CoffeLogo}
//             alt="Coffee CRM Logo"
//             width={40}


//           /></Link>

//         <div className="navbar-nav">
//           {token ? (
//             <>
//               {/* <Link className="nav-link" to="/customers">Clientes</Link> */}

//                 {token && <Link className="nav-link" to="/products">Productos</Link>}

//               {token && <Link className="nav-link" to="/sales">Ventas</Link>}

//               {token && <Link className="nav-link" to="/suppliers">Proveedores</Link>}


//               {token && <Link className="nav-link" to="/product-prices">Precios</Link>}
              

            

//               {token && role === 'ADMIN' && (
//                 <>
//                   <Link className="nav-link" to="/workers">Trabajadores</Link>
//                   <Link className="nav-link" to="/admin/exchange-rates">Tasas</Link>
//                 </>
//               )}



//               <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
//             </>
//           ) : (
//             <Link className="nav-link" to="/login">Login</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };


// // src/components/Navbar.tsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import CoffeLogo from '../assets/CoffeLogo.png';

// export const Navbar: React.FC = () => {
//   const { token, role, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <nav className="navbar navbar-expand-lg bg-dark">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/customers">
//           <img src={CoffeLogo} alt="Coffee CRM Logo" width={40} />
//         </Link>
//         <div className="navbar-nav">
//           {token ? (
//             <>
            
//               <Link className="nav-link" to="/customers">Clientes</Link>
//               <Link className="nav-link" to="/products">Productos</Link>
//               <Link className="nav-link" to="/sales">Ventas</Link>
//               <Link className="nav-link" to="/balances">Cobranza</Link>
//               <Link className="nav-link" to="/suppliers">Proveedores</Link>
//               <Link className="nav-link" to="/product-prices">Precios</Link>


//               {role === 'ADMIN' && (
//                 <>
//                   <Link className="nav-link" to="/workers">Trabajadores</Link>
//                   <Link className="nav-link" to="/admin/exchange-rates">Tasas</Link>
//                 </>
//               )}
//               <button className="btn btn-link nav-link" onClick={handleLogout}>
//                 Cerrar Sesión
//               </button>
//             </>
//           ) : (
//             <Link className="nav-link" to="/login">Login</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };


// 



// src/components/Navbar.tsx
// src/components/Navbar.tsx
// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoffeLogo from '../assets/CoffeLogo.png';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';

// Iconos MUI
import PeopleIcon from '@mui/icons-material/People';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SellIcon from '@mui/icons-material/Sell';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import './Navbar.css'; // Importar reglas de hover y margen

export const Navbar: React.FC = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Define breakpoints: mobile < lg, desktop >= lg
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Lista de enlaces con icono y posible acción
  const links = token ? [
    // { to: '/customers', label: 'Clientes', icon: PeopleIcon },
    { to: '/products', label: 'Productos', icon: LiveTvIcon },
    { to: '/sales', label: 'Ventas', icon: PointOfSaleIcon },
    { to: '/balances', label: 'Cobranza', icon: MonetizationOnIcon },
    { to: '/suppliers', label: 'Proveedores', icon: LocalShippingIcon },
    { to: '/product-prices', label: 'Precios', icon: SellIcon },

    { to: '/reports/dealer',      label: 'Revendedores',        icon: SupportAgentIcon },
     { to: '/reports/supplier-debt',label: 'Deuda Proveedor',    icon: CurrencyBitcoinIcon },
      { to: '/reports/purchases',    label: 'Reporte Compras',      icon: ShoppingBagIcon },
      { to: '/reports/sales',        label: 'Reporte Ventas',       icon: QueryStatsIcon },

    ...(role === 'ADMIN' ? [
      { to: '/workers', label: 'Workers', icon: WorkIcon },
      { to: '/admin/exchange-rates', label: 'Tasas', icon: CurrencyExchangeIcon },
      { to: '/audit-logs', label: 'Auditoria', icon: PeopleIcon },
    ] : []),
    { to: '#logout', label: 'Log out', icon: LogoutIcon, action: handleLogout },
  ] : [
    { to: '/login', label: 'Login', icon: LoginIcon }
  ];



  

  return (
    <>
      {/* Móvil/Tablet: AppBar + Drawer */}
      {isMobile && (
        <>
          <AppBar position="fixed" color="primary">
            <Toolbar>
              <Link to="/customers" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img className="shadow" src={CoffeLogo} alt="Logo" width={40}  style={{ verticalAlign: 'middle', borderRadius: '4px' }}/>
              </Link>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer solo en mobile para que el contenido no quede bajo el AppBar */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                bgcolor: 'grey.900',
                color: 'grey.100',
              }
            }}
          >
            <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
              <List>
                {links.map((link, i) => {
                  const IconComp = link.icon;
                  const isSelected = link.to !== '#logout' && location.pathname === link.to;
                  return (
                    <ListItem key={i} disablePadding>
                      <ListItemButton
                        component={link.action ? 'button' : Link}
                        to={link.action ? undefined : link.to}
                        onClick={link.action}
                        selected={isSelected}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'grey.800',
                            '& .MuiListItemIcon-root': {
                              color: 'primary.main',
                            },
                            '& .MuiListItemText-primary': {
                              color: 'primary.main',
                            },
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'grey.800',
                            '& .MuiListItemIcon-root': {
                              color: 'primary.main',
                            },
                            '& .MuiListItemText-primary': {
                              color: 'primary.main',
                            },
                          },
                        }}
                      >
                        {IconComp && (
                          <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'grey.100' }}>
                            <IconComp />
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={link.label}
                          primaryTypographyProps={{
                            sx: { color: isSelected ? 'primary.main' : 'inherit' }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>
        </>
      )}

      {/* Escritorio: Navbar Bootstrap con iconos y hover */}
    {/* {isDesktop && (
  <nav className="navbar navbar-expand-lg bg-dark py-1">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/customers">
        <img src={CoffeLogo} alt="Coffee CRM Logo" width={40} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav ms-auto">
          {links.map((link, i) => {
            const IconComp = link.icon;
            const isSelected = link.to !== '#logout' && location.pathname === link.to;
            const baseClass = link.action ? 'btn btn-link nav-link mx-2' : 'nav-link mx-2';
            const className = `${baseClass}${isSelected ? ' active' : ''}`;
            return link.action ? (
              <button
                key={i}
                className={className}
                onClick={link.action}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {IconComp && <IconComp className="nav-icon" />}
                {link.label}
              </button>
            ) : (
              <Link
                key={i}
                className={className}
                to={link.to}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {IconComp && <IconComp className="nav-icon" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
)} */}

{/* {isDesktop && (
  <nav className="navbar navbar-expand-lg bg-dark py-1">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/customers">
        <img src={CoffeLogo} alt="Coffee CRM Logo" width={30} style={{ borderRadius: '4px'}}/>
      </Link>
      <button
        className="navbar-toggler py-1"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav ms-auto">
          {links.map((link, i) => {
            const IconComp = link.icon;
            const isSelected = link.to !== '#logout' && location.pathname === link.to;
            const baseClass = link.action
              ? 'btn btn-link nav-link py-1 px-2 fs-6'
              : 'nav-link py-1 px-2 fs-6';
            const className = `${baseClass}${isSelected ? ' active' : ''}`;
            return link.action ? (
              <button
                key={i}
                className={className}
                onClick={link.action}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {IconComp && <IconComp className="nav-icon" fontSize="small" />}
                {link.label}
              </button>
            ) : (
              <Link
                key={i}
                className={className}
                to={link.to}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {IconComp && <IconComp className="nav-icon" fontSize="small" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
)} */}


 {/* DESKTOP: sidebar mini */}
 {isDesktop && (
  <Box className="sidebar">
    {/* Logo fijo arriba */}
    <Link to="/customers" className="sidebar-logo">
      <img src={CoffeLogo} alt="Logo" width={35} style={{ borderRadius: '4px' }} />
      
    </Link>
    

    {/* Links y botones */}
    {links.map((link, i) => {
      const IconComp = link.icon;
      const isSelected = link.to !== '#logout' && location.pathname === link.to;

      // Si es acción (logout), renderiza un <button>
      if (link.action) {
        return (
          <button
            key={i}
            className={`sidebar-item${isSelected ? ' selected' : ''}`}
            onClick={link.action}
            type="button"
          >
            <IconComp className="sidebar-icon" fontSize="small" />
            <span className="sidebar-label">{link.label}</span>
          </button>
        );
      }

      // En otro caso, renderiza un <Link>
      return (
        <Link
          key={i}
          to={link.to}
          className={`sidebar-item${isSelected ? ' selected' : ''}`}
        >
          <IconComp className="sidebar-icon" fontSize="small" />
          <span className="sidebar-label">{link.label}</span>
        </Link>
      );
    })}
  </Box>
)}



    </>
  );
};
