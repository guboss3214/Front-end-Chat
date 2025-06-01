import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'
import '../styles/chatLayout.css'

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <ChatSidebar />
      <ChatWindow
        name="Alice"
        messages={[
          { sender: 'Alice', content: 'Hello, Bob!', timestamp: '10:00 AM' },
        ]}
      />
    </div>
  )
}

export default ChatLayout
