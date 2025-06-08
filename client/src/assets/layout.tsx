import type React from "react"
import Link from "next/link"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>
        <nav>
          <ul>
            <li className="p-2 hover:bg-gray-700">
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link href="/admin/shipments">Shipments</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link href="/admin/shipments/create">Create Shipment</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}

export default AdminLayout
