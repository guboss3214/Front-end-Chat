import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'
import '../styles/chatLayout.css'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type ChatLayoutProps = {
  name: string
  image?: string
  chatId: string
  messages: {
    sender: string
    content: string
    timestamp: string
  }[]
}

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<ChatLayoutProps | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) {
    navigate('/login')
  }
  return (
    <div className="chat-layout">
      <ChatSidebar
        onSelectChat={setSelectedChat}
        currentUserId={`${user?._id ?? ''}`}
      />
      <ChatWindow
        image={selectedChat?.image}
        name={selectedChat?.name ?? ''}
        chatId={selectedChat?.chatId ?? ''}
      />
    </div>
  )
}

export default ChatLayout
