import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import './App.css'

interface DataItem {
  id: number
  name: string
  email: string
  role: string
  department: string
  salary: number
  joinDate: string
}

type SortKey = keyof DataItem
type SortOrder = 'asc' | 'desc' | null

const sampleData: DataItem[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@company.com', role: 'Senior Developer', department: 'Engineering', salary: 95000, joinDate: '2020-03-15' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@company.com', role: 'Product Manager', department: 'Product', salary: 105000, joinDate: '2019-07-22' },
  { id: 3, name: 'Carol White', email: 'carol.w@company.com', role: 'UX Designer', department: 'Design', salary: 85000, joinDate: '2021-01-10' },
  { id: 4, name: 'David Brown', email: 'david.b@company.com', role: 'DevOps Engineer', department: 'Engineering', salary: 92000, joinDate: '2020-11-05' },
  { id: 5, name: 'Emma Davis', email: 'emma.d@company.com', role: 'Marketing Manager', department: 'Marketing', salary: 88000, joinDate: '2021-06-18' },
  { id: 6, name: 'Frank Miller', email: 'frank.m@company.com', role: 'Junior Developer', department: 'Engineering', salary: 65000, joinDate: '2022-09-01' },
  { id: 7, name: 'Grace Lee', email: 'grace.l@company.com', role: 'Data Analyst', department: 'Analytics', salary: 78000, joinDate: '2021-03-20' },
  { id: 8, name: 'Henry Wilson', email: 'henry.w@company.com', role: 'Sales Director', department: 'Sales', salary: 115000, joinDate: '2018-05-12' },
  { id: 9, name: 'Iris Taylor', email: 'iris.t@company.com', role: 'HR Manager', department: 'Human Resources', salary: 82000, joinDate: '2020-08-30' },
  { id: 10, name: 'Jack Anderson', email: 'jack.a@company.com', role: 'Software Architect', department: 'Engineering', salary: 125000, joinDate: '2017-02-14' },
  { id: 11, name: 'Karen Martinez', email: 'karen.m@company.com', role: 'Content Writer', department: 'Marketing', salary: 62000, joinDate: '2022-04-05' },
  { id: 12, name: 'Leo Garcia', email: 'leo.g@company.com', role: 'QA Engineer', department: 'Engineering', salary: 72000, joinDate: '2021-10-15' },
  { id: 13, name: 'Maria Rodriguez', email: 'maria.r@company.com', role: 'Finance Manager', department: 'Finance', salary: 98000, joinDate: '2019-12-01' },
  { id: 14, name: 'Nathan Clark', email: 'nathan.c@company.com', role: 'Customer Success', department: 'Support', salary: 68000, joinDate: '2022-01-20' },
  { id: 15, name: 'Olivia Lewis', email: 'olivia.l@company.com', role: 'UI Designer', department: 'Design', salary: 80000, joinDate: '2021-07-08' },
  { id: 16, name: 'Peter Walker', email: 'peter.w@company.com', role: 'Backend Developer', department: 'Engineering', salary: 90000, joinDate: '2020-05-25' },
  { id: 17, name: 'Quinn Hall', email: 'quinn.h@company.com', role: 'Business Analyst', department: 'Analytics', salary: 75000, joinDate: '2021-11-12' },
  { id: 18, name: 'Rachel Young', email: 'rachel.y@company.com', role: 'Legal Counsel', department: 'Legal', salary: 110000, joinDate: '2019-09-18' },
  { id: 19, name: 'Sam King', email: 'sam.k@company.com', role: 'Frontend Developer', department: 'Engineering', salary: 87000, joinDate: '2020-12-03' },
  { id: 20, name: 'Tina Wright', email: 'tina.w@company.com', role: 'Operations Manager', department: 'Operations', salary: 93000, joinDate: '2019-04-22' },
  { id: 21, name: 'Uma Patel', email: 'uma.p@company.com', role: 'Security Engineer', department: 'Engineering', salary: 102000, joinDate: '2020-07-14' },
  { id: 22, name: 'Victor Scott', email: 'victor.s@company.com', role: 'Account Manager', department: 'Sales', salary: 79000, joinDate: '2021-08-29' },
  { id: 23, name: 'Wendy Green', email: 'wendy.g@company.com', role: 'Recruiter', department: 'Human Resources', salary: 70000, joinDate: '2022-02-16' },
  { id: 24, name: 'Xavier Adams', email: 'xavier.a@company.com', role: 'Mobile Developer', department: 'Engineering', salary: 91000, joinDate: '2020-10-08' },
  { id: 25, name: 'Yara Baker', email: 'yara.b@company.com', role: 'Social Media Manager', department: 'Marketing', salary: 66000, joinDate: '2022-05-11' },
]

function App() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortKey(null)
      } else {
        setSortOrder('asc')
      }
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return sampleData

    return [...sampleData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [sortKey, sortOrder])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sortedData.slice(startIndex, endIndex)

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />
    }
    if (sortOrder === 'asc') {
      return <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
    }
    return <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Directory</h1>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center">
                      Department
                      {getSortIcon('department')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('salary')}
                  >
                    <div className="flex items-center">
                      Salary
                      {getSortIcon('salary')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Join Date
                      {getSortIcon('joinDate')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {item.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                      ${item.salary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
