# 🐶 Coffee CRM

**Coffee CRM** es un sistema de gestión de clientes desarrollado para administrar ventas, renovaciones, productos digitales y cobros de forma eficiente. Pensado especialmente para negocios que manejan cuentas digitales, como suscripciones a servicios de streaming o herramientas SaaS.

Este CRM fue desarrollado como solución interna para una empresa real y está compuesto por un backend robusto en Node.js/TypeScript y un frontend intuitivo en React.

---

## 🚀 Características principales

- Gestión de clientes (creación, edición, historial)
- Administración de productos con slots dinámicos
- Módulo de ventas y generación de facturas automáticas
- Sistema de cobranza con alertas de vencimiento
- Gestión de revendedores y reportes por quincena/mes
- Control de deuda a proveedores
- Reporte de ventas
- Reporte de compras
- Seguridad con JWT y encriptación de contraseñas con Bcrypt
- Interfaz moderna con Bootstrap y Material UI

---

## 🛠️ Tecnologías utilizadas

### 🔧 Backend
- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT** (JSON Web Tokens)
- **Bcrypt** (hash de contraseñas)

### 🎨 Frontend
- **React**
- **Vite**
- **TypeScript**
- **Bootstrap 5**
- **Material UI**

---

## ⚙️ Instalación local

### 1. Clona los dos repositorios


# Backend
```
git clone https://github.com/jironDev/crm-nicastream.git
cd coffee-crm-backend
```
# Frontend
```
git clone https://github.com/jironDev/coffe-crm-frontend.git
cd coffee-crm-frontend
```

### 2. Configura las variables de entorno
En ambos proyectos, crea un archivo .env con las variables necesarias.

Ejemplo para backend:
```
DATABASE_URL=postgresql://user:password@localhost:5432/coffe_crm
JWT_SECRET=una_clave_secreta
```

### 3. Levanta el proyecto (con Docker)
```
docker-compose up --build
```

### O manualmente:
```
cd crm-nicastream
npm install
npm run dev
# En otra terminal
cd coffe-crm-frontend
npm install
npm run dev
```


## 🖥️ Módulos del sistema

Coffee CRM incluye:

- Módulo	Funcionalidad principal
- Login	Autenticación de usuarios con tokens JWT
- Clientes	Alta, edición, eliminación (solo admin), historial de compras
- Productos	Gestión de cuentas digitales con slots disponibles dinámicos
- Ventas	Registro detallado, asignación de productos, historial y facturación
- Cobranza	Alertas por vencimiento, cálculo de saldo restante, renovación de servicios
- Proveedores	Registro y gestión de proveedores
- Precios	Tabla de precios dinámica vinculada a tasas de cambio 
- Reportes	Informes de revendedores, deuda a proveedores y facturación agrupada automáticamente 

---

## 📄 Manual de uso
El manual detallado del sistema con pantallas, flujos y explicaciones para el usuario está disponible aquí:

📘 [docs/MANUAL_USUARIO.pdf](https://drive.google.com/file/d/1CUxIL-jdjypzCTg78XAIFp7eTp7JEJzm/view?usp=drive_link).


## 📦 Endpoints de la API

**Login**
```
GET https://crm-nicastream.onrender.com/auth/login
```

**Workers**
```
createWorker
POST https://crm-nicastream.onrender.com/workers/

getAllWorkers
GET https://crm-nicastream.onrender.com/workers/

getWorkerById
GET https://crm-nicastream.onrender.com/workers/:id

updateWorker
PUT https://crm-nicastream.onrender.com/workers/:id

deleteWorker
DELETE https://crm-nicastream.onrender.com/workers
```

**Customers**
```
getAllCustomers
GET https://crm-nicastream.onrender.com/customers/all-customers

getCustomerById
GET https://crm-nicastream.onrender.com/customers/get-customer/:id

createCustomer
POST https://crm-nicastream.onrender.com/customers/add-customer

updateCustomer
PUT https://crm-nicastream.onrender.com/customers/update-customer/:id

deleteCustomer
DELETE https://crm-nicastream.onrender.com/admin/delete-customer/:id
```

**Suppliers**
```
getAllSuppliers
GET https://crm-nicastream.onrender.com/suppliers/

getSupplierById
GET https://crm-nicastream.onrender.com/suppliers/:id

createSupplier
POST https://crm-nicastream.onrender.com/suppliers/

updateSupplier
PUT https://crm-nicastream.onrender.com/suppliers/:id

deleteSupplier
DELETE https://crm-nicastream.onrender.com/suppliers/:id
```






---

##  📌 Estado del proyecto
✅ Proyecto en funcionamiento.
🔒 Repositorio privado.
📧 Contacta para acceso de solo lectura si eres reclutador.

---

## 👨‍💻 Autor
Desarrollado por Enmanuel Jiron
📫 Correo: [enmanueljiron12@gmail.comm]
🌐 LinkedIn (si deseas incluirlo)

---

## 📃 Licencia
Uso interno. No autorizado para redistribución sin permiso del autor.

---





