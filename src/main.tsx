import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import App from './App'
import './index.css'

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-warm-50">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-earth-700 mb-2">出了点问题</h1>
            <p className="text-earth-500 mb-4">应用遇到了意外错误，请刷新页面重试</p>
            <button
              className="bg-warm-500 text-white px-6 py-2 rounded-xl hover:bg-warm-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
