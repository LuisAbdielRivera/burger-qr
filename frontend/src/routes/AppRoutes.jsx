import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Menu from '../pages/Menu.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import OrderSummary from '../pages/OrderSummary.jsx'
import OrderSuccess from '../pages/OrderSuccess.jsx'
import AdminLogin from '../pages/admin/AdminLogin.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminProducts from '../pages/admin/AdminProducts.jsx'
import AdminOrders from '../pages/admin/AdminOrders.jsx'
import AdminRoute from './AdminRoute.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/producto" element={<ProductDetail />} />
        <Route path="/pedido" element={<OrderSummary />} />
        <Route path="/exito" element={<OrderSuccess />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="pedidos" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}