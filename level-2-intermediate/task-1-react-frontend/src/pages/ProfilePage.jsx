import React from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.full_name || 'User'}</h2>
            <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" defaultValue={user?.full_name || ''} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" defaultValue={user?.email || ''} disabled />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
