import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/Layout'
import AuthProvider from '@/features/auth/AuthProvider'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import HomePage from '@/features/home/HomePage'
import SearchPage from '@/features/search/SearchPage'
import PetDetailPage from '@/features/pets/PetDetailPage'
import AdoptPage from '@/features/adoption/AdoptPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="pets/:id" element={<PetDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="adopt/:petId" element={<AdoptPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<div className="p-8 text-center text-earth-500">用户中心 — 开发中</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
