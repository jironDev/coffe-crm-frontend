
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import { Navbar } from './components/Navbar';
// import Login from './pages/Login';
// // import Home from './pages/Home';
// import WorkerList from './pages/Workers/WorkerList';
// import WorkerForm from './pages/Workers/WorkerForm';
// import AdminExchangeRates from './pages/AdminExchangeRates';
// import ProductPrices from './pages/ProductPrices';
// import ProductPriceForm from './pages/ProductPriceForm';
// import Suppliers from './pages/Suppliers';
// import SupplierForm from './pages/SupplierForm';
// import Products from './pages/Products';
// import ProductForm from './pages/ProductForm';
// import Customers from './pages/Customers';
// import CustomerForm from './pages/CustomerForm';
// import Sales from './pages/Sales';
// import SaleForm from './pages/SaleForm';
// import CustomerDetail from './pages/CustomerDetail';
// import { Navigate } from 'react-router-dom';

// export const CoffeCrm = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <Navbar />
//         <Routes>
//          <Route path="/" element={<Navigate to="/login" replace />} />


//           <Route path="/login" element={<Login />} />
//           <Route element={<ProtectedRoute />}>
//             {/* <Route path="/" element={<Home />} /> */}
//             <Route path="/workers" element={<WorkerList />} />
//             <Route path="/workers/new" element={<WorkerForm />} />
//             <Route path="/workers/edit/:id" element={<WorkerForm isEdit={true} />} />
            
//             {/* rutas admin sólo si role==='ADMIN' */}
//             <Route path="/admin/exchange-rates" element={<AdminExchangeRates />} />

//            {/* ==== RUTAS DE PRODUCT PRICES (todas aquí) ==== */}
//             <Route path="/product-prices" element={<ProductPrices />} />
//             <Route path="/product-prices/new" element={<ProductPriceForm />} />
//             <Route path="/product-prices/edit/:id" element={<ProductPriceForm isEdit />} />

//             <Route path="/suppliers" element={<Suppliers />} />
//            <Route path="/suppliers/new" element={<SupplierForm />} />
//           <Route path="/suppliers/edit/:id" element={<SupplierForm isEdit />} />

//           <Route path="/products" element={<Products />} />
//     <Route path="/products/new" element={<ProductForm />} />
//     <Route path="/products/edit/:id" element={<ProductForm isEdit />} />

//     <Route path="/customers" element={<Customers />} />
//     <Route path="/customers/new" element={<CustomerForm />} />
//     <Route path="/customers/edit/:id" element={<CustomerForm isEdit />} />
//     <Route path="/customers/view/:id" element={<CustomerDetail />} />

//          <Route path="/sales" element={<Sales />} />
//      <Route path="/sales/new" element={<SaleForm />} />
//      <Route path="/sales/edit/:id" element={<SaleForm  />} />

//           </Route>
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }


// src/CoffeCrm.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';
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
import NotFound from './pages/NotFound';
import Balances from './pages/Balances';
import BalancesByOrder from './pages/BalancesByOrder';
import DealerReport from './pages/Reportes/DealerReport';
import SupplierDebtReport from './pages/Reportes/SupplierDebtReport';
import PurchaseReportPage from './pages/Reportes/PurchaseReportPage';
import SalesReportPage from './pages/Reportes/SalesReportPage';
import AuditLogs from './pages/Reportes/AuditLogs';

const HomeRedirect: React.FC = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/customers" replace /> : <Navigate to="/login" replace />;
};

export const CoffeCrm: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="workers" element={<WorkerList />} />
              <Route path="workers/new" element={<WorkerForm />} />
              <Route path="workers/edit/:id" element={<WorkerForm isEdit />} />

              <Route path="admin/exchange-rates" element={<AdminExchangeRates />} />

              <Route path="product-prices" element={<ProductPrices />} />
              <Route path="product-prices/new" element={<ProductPriceForm />} />
              <Route path="product-prices/edit/:id" element={<ProductPriceForm isEdit />} />

              <Route path="suppliers" element={<Suppliers />} />
              <Route path="suppliers/new" element={<SupplierForm />} />
              <Route path="suppliers/edit/:id" element={<SupplierForm isEdit />} />

              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm isEdit />} />

              <Route path="customers" element={<Customers />} />
              <Route path="customers/new" element={<CustomerForm />} />
              <Route path="customers/edit/:id" element={<CustomerForm isEdit />} />
              <Route path="customers/view/:id" element={<CustomerDetail />} />

              <Route path="sales" element={<Sales />} />
              <Route path="sales/new" element={<SaleForm />} />
              <Route path="sales/edit/:id" element={<SaleForm />} />
              <Route path="/renew-sale" element={<SaleForm />} />

              <Route path="/balances" element={<Balances />} />
            <Route path="/balances/:id" element={<BalancesByOrder />} />

            <Route path="/reports/dealer" element={<DealerReport />} />
            <Route path="/reports/supplier-debt" element={<SupplierDebtReport />} />
            <Route path="/reports/purchases" element={<PurchaseReportPage />} />
            <Route path="/reports/sales" element={<SalesReportPage />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>



          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
