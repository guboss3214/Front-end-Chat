import { useState } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, email: string) => void
}

const CreateUserModal = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      alert('Name and email are required')
      return
    }
    onSubmit(name.trim(), email.trim())
    setName('')
    setEmail('')
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>
              Full Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: 5 }}
                autoFocus
              />
            </label>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: 5 }}
              />
            </label>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={{ marginRight: 10 }}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserModal
