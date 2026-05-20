import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-warm-600">暖心宠物领养平台</h1>
      </div>} />
    </Routes>
  )
}

export default App
