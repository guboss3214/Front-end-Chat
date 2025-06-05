import { Search, User } from 'lucide-react'
import ChatList from './ChatList'
import '../styles/chatSidebar.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import CreateUserModal from './CreateUserModal'
import axiosInstance from '../lib/AxiosInstance'

type UserData = {
  _id: string
  name: string
  email: string
}

type ChatLayoutProps = {
  _id?: string
  name: string
  image?: string
  chatId: string
  messages: {
    sender: string
    content: string
    timestamp: string
  }[]
}

type ChatSidebarProps = {
  onSelectChat: (chat: ChatLayoutProps | null) => void
  currentUserId: string
  lastMessage?: string
}

const ChatSidebar = ({ onSelectChat, currentUserId }: ChatSidebarProps) => {
  const [users, setUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { user, loading } = useAuth()

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/api/users')
      setUsers(res.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleUserClick = async (user: UserData) => {
    try {
      const chatRes = await axiosInstance.post('/api/chats/find', {
        userId1: currentUserId,
        userId2: user._id,
      })

      const chat = chatRes.data

      const messagesRes = await axiosInstance.get(
        `/api/messages/chat/${chat._id}`
      )

      const messages = messagesRes.data

      onSelectChat({
        name: user.name,
        image: '',
        chatId: chat._id,
        messages,
      })
    } catch (error) {
      console.error('Error opening chat:', error)
    }
  }

  const handleCreateNewChat = async (name: string, email: string) => {
    try {
      setShowModal(false)

      let userToChat: UserData | undefined = users.find(
        (u) => u.email.trim().toLowerCase() === email.toLowerCase()
      )

      if (!userToChat) {
        const createUserRes = await axiosInstance.post<UserData>(
          '/api/auth/register',
          {
            name,
            email,
          }
        )
        userToChat = createUserRes.data
        toast.success('New user created')
      }

      if (!userToChat) {
        toast.error('User creation failed')
        return
      }

      if (userToChat._id === currentUserId) {
        toast.error('Cannot chat with yourself')
        return
      }

      const chatRes = await axiosInstance.post<{ _id: string }>('/api/chats/', {
        userIds: [currentUserId, userToChat._id],
      })

      const chat = chatRes.data

      const messagesRes = await axiosInstance.get<
        {
          sender: string
          content: string
          timestamp: string
        }[]
      >(`/api/messages/chat/${chat._id}`)

      const messages = messagesRes.data

      onSelectChat({
        name: userToChat.name,
        image: '',
        chatId: chat._id,
        messages,
      })

      toast.success('Chat created successfully')
      fetchUsers()
    } catch (error: unknown) {
      console.error('Error creating chat:', error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUserId &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <aside className="chat-sidebar">
        <header className="chat-header">
          <div className="user-inter">
            <div className="user-info">
              <div>
                <User />
              </div>
              <div>
                {!loading && user ? (
                  <span>{user.email}</span>
                ) : (
                  <Link to="/login" className="button">
                    Log in
                  </Link>
                )}
              </div>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" size={16} />
            </div>
            <div className="create-chat">
              <button
                className="create-chat-button"
                onClick={() => setShowModal(true)}
              >
                Create new chat
              </button>
            </div>
          </div>
        </header>

        {filteredUsers.map((user) => (
          <div key={user._id} onClick={() => handleUserClick(user)}>
            <ChatList
              avatar=""
              name={user.name}
              message="Click to load messages"
              date={new Date().toLocaleString()}
            />
          </div>
        ))}
      </aside>
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateNewChat}
      />
    </>
  )
}

export default ChatSidebar
