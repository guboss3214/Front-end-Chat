import React, { useEffect, useState } from 'react'
import '../styles/editChatNameModal.css'

type EditChatNameModalProps = {
  isOpen: boolean
  currentName: string
  onClose: () => void
  onConfirm: (newName: string) => void
}

const EditChatNameModal: React.FC<EditChatNameModalProps> = ({
  isOpen,
  currentName,
  onClose,
  onConfirm,
}) => {
  const [newName, setNewName] = useState(currentName || '')
  useEffect(() => {
    setNewName(currentName || '')
  }, [currentName])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit chat name</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onClose}>Cansel</button>
          <button onClick={() => onConfirm(newName)}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default EditChatNameModal
