import { Search, User } from 'lucide-react'
import ChatList from './ChatList'

import '../styles/ChatSidebar.css'

const ChatSidebar = () => {
  return (
    <aside className="chat-sidebar">
      <header className="chat-header">
        <div className="user-inter">
          <div className="user-info">
            <div>
              {/* <img src="" alt="user-avatar" /> */}
              <User />
            </div>
            <div>
              <button className="button">Log in</button>
            </div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <Search className="search-icon" size={16} />
          </div>
        </div>
      </header>
      <ChatList
        avatar=""
        name="John Doe"
        message="Hello, how are you?"
        date="2023-08-01"
      />
    </aside>
  )
}

export default ChatSidebar
