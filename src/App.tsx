import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/Layout'
import AuthProvider from '@/features/auth/AuthProvider'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div className="p-8 text-center text-earth-500">首页 — 开发中</div>} />
          <Route path="pets/:id" element={<div className="p-8 text-center text-earth-500">宠物详情 — 开发中</div>} />
          <Route path="search" element={<div className="p-8 text-center text-earth-500">搜索结果 — 开发中</div>} />
          <Route path="adopt/:petId" element={<div className="p-8 text-center text-earth-500">领养申请 — 开发中</div>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<div className="p-8 text-center text-earth-500">用户中心 — 开发中</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
