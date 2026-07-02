import React from 'react'
import { MinusCircle } from 'lucide-react'

function ExpensesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Monitor and categorize your spending</p>
        </div>
        <button className="btn btn-primary flex items-center">
          <MinusCircle size={16} className="mr-2" />
          Add Expense
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <MinusCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No expenses recorded yet</h2>
        <p className="text-gray-500 mb-6">Start tracking your spending by adding an expense</p>
        <button className="btn btn-primary">Add Your First Expense</button>
      </div>
    </div>
  )
}

export default ExpensesPage
