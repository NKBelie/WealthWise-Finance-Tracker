import React from 'react'
import { Calculator } from 'lucide-react'

function BudgetsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">Create and monitor your spending budgets</p>
        </div>
        <button className="btn btn-primary flex items-center">
          <Calculator size={16} className="mr-2" />
          Create Budget
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calculator size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No budgets created yet</h2>
        <p className="text-gray-500 mb-6">Set up budgets to control your spending</p>
        <button className="btn btn-primary">Create Your First Budget</button>
      </div>
    </div>
  )
}

export default BudgetsPage
