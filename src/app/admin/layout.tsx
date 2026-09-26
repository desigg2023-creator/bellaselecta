import React from 'react'
import { getSessionUser } from '@/lib/auth'
import AdminSidebar from '@/components/AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getSessionUser()

  // Pass only plain serializable values to the Client Component
  const sidebarUser = user
    ? { name: user.name ?? '', email: user.email ?? '', role: user.role ?? '' }
    : null

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex">
      {sidebarUser && <AdminSidebar user={sidebarUser} />}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
