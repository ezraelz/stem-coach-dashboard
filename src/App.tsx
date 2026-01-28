import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import AdminLayout from './layouts/adminLayouts'
import AdminRoute from './routes/adminRoute'
import ProtectedRoute from './routes/protectedRoutes'
import UserLayouts from './layouts/userLayouts'
import UserRoute from './routes/userRoute'

function App() {

  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/*" 
          element={
            <ProtectedRoute >
              <AdminLayout />
            </ProtectedRoute>
          }> 
          <Route path='*' element={<AdminRoute />} />
        </Route>

        {/* User Routes */}
        <Route path="/users/*" 
          element={
            <UserLayouts />
          }> 
          <Route path='*' element={<UserRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
