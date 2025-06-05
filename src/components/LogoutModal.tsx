import React from 'react'
import '../styles/logoutModal.css'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to log out?</h2>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
