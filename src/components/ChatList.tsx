import { User } from 'lucide-react'
import '../styles/chatList.css'

type ChatItemProps = {
  avatar?: string
  name: string
  message: string
  date?: string
}

const ChatList: React.FC<ChatItemProps> = ({ avatar, name, message, date }) => {
  return (
    <div className="chat-item">
      {avatar ? (
        <img src={avatar} alt="User Avatar" className="chat-avatar" />
      ) : (
        <User />
      )}
      <div className="chat-info">
        <div className="chat-user__header">
          <span className="chat-name">{name}</span>
          <span className="chat-date">{date}</span>
        </div>
        <div className="chat-message">{message}</div>
      </div>
    </div>
  )
}

export default ChatList
