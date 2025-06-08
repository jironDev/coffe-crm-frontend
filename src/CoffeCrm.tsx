
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
// import Home from './pages/Home';
import WorkerList from './pages/Workers/WorkerList';
import WorkerForm from './pages/Workers/WorkerForm';
import AdminExchangeRates from './pages/AdminExchangeRates';
import ProductPrices from './pages/ProductPrices';
import ProductPriceForm from './pages/ProductPriceForm';
import Suppliers from './pages/Suppliers';
import SupplierForm from './pages/SupplierForm';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Customers from './pages/Customers';
import CustomerForm from './pages/CustomerForm';
import Sales from './pages/Sales';
import SaleForm from './pages/SaleForm';
import CustomerDetail from './pages/CustomerDetail';
import { Navigate } from 'react-router-dom';

export const CoffeCrm = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
         <Route path="/" element={<Navigate to="/login" replace />} />


          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/workers" element={<WorkerList />} />
            <Route path="/workers/new" element={<WorkerForm />} />
            <Route path="/workers/edit/:id" element={<WorkerForm isEdit={true} />} />
            
            {/* rutas admin sólo si role==='ADMIN' */}
            <Route path="/admin/exchange-rates" element={<AdminExchangeRates />} />

           {/* ==== RUTAS DE PRODUCT PRICES (todas aquí) ==== */}
            <Route path="/product-prices" element={<ProductPrices />} />
            <Route path="/product-prices/new" element={<ProductPriceForm />} />
            <Route path="/product-prices/edit/:id" element={<ProductPriceForm isEdit />} />

            <Route path="/suppliers" element={<Suppliers />} />
           <Route path="/suppliers/new" element={<SupplierForm />} />
          <Route path="/suppliers/edit/:id" element={<SupplierForm isEdit />} />

          <Route path="/products" element={<Products />} />
    <Route path="/products/new" element={<ProductForm />} />
    <Route path="/products/edit/:id" element={<ProductForm isEdit />} />

    <Route path="/customers" element={<Customers />} />
    <Route path="/customers/new" element={<CustomerForm />} />
    <Route path="/customers/edit/:id" element={<CustomerForm isEdit />} />
    <Route path="/customers/view/:id" element={<CustomerDetail />} />

         <Route path="/sales" element={<Sales />} />
     <Route path="/sales/new" element={<SaleForm />} />
     <Route path="/sales/edit/:id" element={<SaleForm  />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
