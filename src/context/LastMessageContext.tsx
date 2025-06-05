import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Sender =
  | {
      _id: string
      name?: string
      avatar?: string
    }
  | string

type Message = {
  sender: Sender
  text: string
  createdAt: string
}

type LastMessagesMap = {
  [chatId: string]: Message
}

type LastMessagesContextType = {
  lastMessages: LastMessagesMap
  setLastMessage: (chatId: string, message: Message) => void
}

const LastMessagesContext = createContext<LastMessagesContextType | undefined>(
  undefined
)

export const LastMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [lastMessages, setLastMessages] = useState<LastMessagesMap>({})

  const setLastMessage = (chatId: string, message: Message) => {
    setLastMessages((prev) => ({
      ...prev,
      [chatId]: message,
    }))
  }

  return (
    <LastMessagesContext.Provider value={{ lastMessages, setLastMessage }}>
      {children}
    </LastMessagesContext.Provider>
  )
}

export const useLastMessages = () => {
  const context = useContext(LastMessagesContext)
  if (!context) {
    throw new Error('useLastMessages must be used within LastMessagesProvider')
  }
  return context
}
