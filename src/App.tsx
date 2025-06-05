import { Navigate, Route, Routes } from 'react-router-dom'
import ChatLayout from './components/ChatLayout'
import LoginPage from './pages/LogIn'
import { Toaster } from 'react-hot-toast'
import { LastMessagesProvider } from './context/LastMessageContext'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <LastMessagesProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/chats" />} />
        <Route path="/chats" element={<ChatLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Toaster />
    </LastMessagesProvider>
  )
}

export default App
