import { Pencil, SendHorizontal, Trash2, User } from 'lucide-react'
import '../styles/chatWindow.css'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import Modal from './ModalDelete'
import EditChatNameModal from './EditChatNameModal'
import axiosInstance from '../lib/AxiosInstance'

type ChatWindowProps = {
  image?: string
  name: string
  chatId: string
}

type Sender =
  | {
      _id: string
      name?: string
      avatar?: string
    }
  | string

type Message = {
  _id: string
  sender: Sender
  text: string
  createdAt: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ image, name, chatId }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const lastShownMessageIdRef = useRef<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false)

  const LOCAL_STORAGE_CHAT_NAME_KEY = `${chatId}`
  const [chatName, setChatName] = useState(() => {
    if (!chatId) return ''
    const savedName = localStorage.getItem(LOCAL_STORAGE_CHAT_NAME_KEY)
    return savedName ?? name ?? ''
  })

  const isEmpty = chatId === ''

  const LAST_MESSAGE_KEY = `lastMessageId_${chatId}`

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  const openEditNameModal = () => setIsEditNameModalOpen(true)
  const closeEditNameModal = () => setIsEditNameModalOpen(false)

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/api/messages/chat/${chatId}`)
      setMessages(res.data)
      console.log('✅ Messages fetched:', res)
    } catch (error) {
      console.error('❌ Error fetching messages:', error)
    }
  }

  useEffect(() => {
    if (chatId) {
      fetchMessages()
      // При зміні чату завантажуємо назву з localStorage або з пропса
      const savedName = localStorage.getItem(LOCAL_STORAGE_CHAT_NAME_KEY)
      setChatName(savedName ?? name ?? '')
    }
  }, [chatId, name])

  useEffect(() => {
    const interval = setInterval(() => {
      if (chatId) fetchMessages()
    }, 3000)
    return () => clearInterval(interval)
  }, [chatId])

  const getSenderId = (sender: Sender): string => {
    if (typeof sender === 'string') return sender
    if (sender && typeof sender === 'object' && '_id' in sender) {
      return sender._id
    }
    return ''
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    const senderId = getSenderId(lastMessage.sender)
    const savedLastMessageId = localStorage.getItem(LAST_MESSAGE_KEY)

    if (
      lastMessage._id !== savedLastMessageId &&
      lastMessage._id !== lastShownMessageIdRef.current &&
      senderId !== user?._id
    ) {
      toast.success(`New message: "${lastMessage.text}"`, {
        duration: 2000,
      })
      localStorage.setItem(LAST_MESSAGE_KEY, lastMessage._id)
      lastShownMessageIdRef.current = lastMessage._id
    }

    scrollToBottom()
  }, [messages, chatId])

  const sendMessage = async () => {
    if (!inputValue.trim()) {
      toast.error('Please enter a message')
      return
    }
    if (!user?._id) {
      toast.error('Please log in to send messages')
      return
    }

    try {
      await axiosInstance.post('/api/messages', {
        chat: chatId,
        sender: user._id,
        text: inputValue,
      })

      setInputValue('')
      fetchMessages()
    } catch (error) {
      console.error('❌ Error sending message:', error)
    }
  }

  const deleteMessageById = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/api/messages/${messageId}`)
      toast.success('Message deleted')
      fetchMessages()
    } catch (error) {
      console.error('❌ Error deleting message:', error)
      toast.error('Failed to delete message')
    }
  }

  const updateMessageById = async (messageId: string, newText: string) => {
    if (!newText.trim()) {
      toast.error('Message text cannot be empty')
      return
    }
    try {
      await axiosInstance.put(`/api/messages/${messageId}`, {
        text: newText,
      })
      toast.success('Message updated')
      fetchMessages()
    } catch (error) {
      console.error('❌ Error updating message:', error)
      toast.error('Failed to update message')
    }
  }

  const startEditing = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId)
    setEditingText(currentText)
  }

  const cancelEditing = () => {
    setEditingMessageId(null)
    setEditingText('')
  }

  const saveEditing = () => {
    if (editingMessageId) {
      updateMessageById(editingMessageId, editingText)
      setEditingMessageId(null)
      setEditingText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  const handleConfirm = async () => {
    try {
      await axiosInstance.delete(`/api/chats/${chatId}`)
      toast.success('Chat deleted')
      fetchMessages()
    } catch (error) {
      console.error('❌ Error confirming:', error)
    }
    closeDeleteModal()
  }

  const handleEditChatNameLocally = (newName: string) => {
    setChatName(newName)
    localStorage.setItem(LOCAL_STORAGE_CHAT_NAME_KEY, newName)
    closeEditNameModal()
    toast.success('Chat name updated')
  }

  return (
    <div className="chat-window">
      {isEmpty ? (
        <div className="chat-window-empty">
          <p className="chat-window-empty-text">
            Select a chat to start messaging
          </p>
        </div>
      ) : (
        <>
          <div className="chat-window__header">
            <div className="user-window__info">
              {image ? (
                <img src={image} alt="User Avatar" className="chat-avatar" />
              ) : (
                <User />
              )}
              <span className="chat-name">{chatName}</span>
              <div className="message-actions">
                <Pencil
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={openEditNameModal}
                />
                <Trash2
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={openDeleteModal}
                />
                <Modal
                  isOpen={isDeleteModalOpen}
                  title="Підтвердження дії"
                  message="Ви впевнені, що хочете продовжити?"
                  onConfirm={handleConfirm}
                  onCancel={closeDeleteModal}
                />
                <EditChatNameModal
                  isOpen={isEditNameModalOpen}
                  currentName={chatName}
                  onClose={() => setIsEditNameModalOpen(false)}
                  onConfirm={handleEditChatNameLocally}
                />
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <p className="no-messages-text">
                You have not created a dialogue with {chatName}.
              </p>
            ) : (
              <>
                {messages.map((message) => {
                  const senderId = getSenderId(message.sender)
                  const isOwnMessage = senderId === user?._id
                  const isEditing = editingMessageId === message._id

                  return (
                    <div
                      key={message._id}
                      className={`message ${
                        isOwnMessage ? 'message--own' : 'message--other'
                      }`}
                    >
                      <div className="message-content">
                        {!isOwnMessage && <User />}
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                        ) : (
                          <span className="message-text">{message.text}</span>
                        )}
                      </div>
                      <div>
                        {isOwnMessage ? (
                          <div className="message-actions">
                            {isEditing ? (
                              <>
                                <button onClick={saveEditing}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <Pencil
                                  size={20}
                                  onClick={() =>
                                    startEditing(message._id, message.text)
                                  }
                                  style={{ cursor: 'pointer' }}
                                />
                                <Trash2
                                  size={20}
                                  onClick={() => deleteMessageById(message._id)}
                                  style={{ cursor: 'pointer', marginLeft: 8 }}
                                />
                              </>
                            )}
                          </div>
                        ) : null}
                        <span className="message-timestamp">
                          {new Date(message.createdAt)
                            .toLocaleString()
                            .slice(0, 17)}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="chat-input">
            <div className="chat-input__field-container">
              <input
                type="text"
                className="chat-input__field"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendHorizontal
                className="send-btn"
                size={24}
                onClick={sendMessage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatWindow
