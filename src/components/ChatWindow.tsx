import { SendHorizontal, User } from 'lucide-react'
import '../styles/chatWindow.css'

type ChatWindowProps = {
  image?: string
  name: string
  messages: Array<{
    sender: string
    content: string
    timestamp: string
  }>
}

const ChatWindow: React.FC<ChatWindowProps> = ({ image, name, messages }) => {
  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="user-window__info">
          {image ? (
            <img src={image} alt="User Avatar" className="chat-avatar" />
          ) : (
            <User />
          )}
          <span className="chat-name">{name}</span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="message-content">
              <User />
              <span className="message-text">{message.content}</span>
            </div>
            <span className="message-timestamp">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="chat-input__field-container">
          <input
            type="text"
            className="chat-input__field"
            placeholder="Type your message..."
          />
          <SendHorizontal className="send-btn" size={24} />
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
