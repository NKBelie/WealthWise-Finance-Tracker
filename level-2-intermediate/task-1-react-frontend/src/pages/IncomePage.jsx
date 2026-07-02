import React from 'react'
import { PlusCircle } from 'lucide-react'

function IncomePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600 mt-1">Track and manage your income sources</p>
        </div>
        <button className="btn btn-primary flex items-center">
          <PlusCircle size={16} className="mr-2" />
          Add Income
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <PlusCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No income records yet</h2>
        <p className="text-gray-500 mb-6">Start by adding your first income source</p>
        <button className="btn btn-primary">Add Your First Income</button>
      </div>
    </div>
  )
}

export default IncomePage
