import React from 'react'
import { BarChart3 } from 'lucide-react'

function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Analyze your financial data with detailed reports</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No data to report yet</h2>
        <p className="text-gray-500">Add income and expenses to generate financial reports</p>
      </div>
    </div>
  )
}

export default ReportsPage
