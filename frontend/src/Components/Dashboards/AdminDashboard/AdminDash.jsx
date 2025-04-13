 
export const AdminDash = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 h-full bg-gray-900 px-5 py-2">
        <h1 className="text-gray-50 font-bold text-3xl mb-6">Admin Dash</h1>
        <ul className="space-y-4 text-gray-300">
          <li className="hover:text-white cursor-pointer">Manage Users</li>
          <li className="hover:text-white cursor-pointer">Manage Job Postings</li>
          <li className="hover:text-white cursor-pointer">Content Moderation</li>
          <li className="hover:text-white cursor-pointer">Analytics & Reporting</li>
          <li className="hover:text-white cursor-pointer">Manage Payments</li>
          <li className="hover:text-white cursor-pointer">System Management</li>
          <li className="hover:text-white cursor-pointer">Notifications</li>
          <li className="hover:text-white cursor-pointer">Help & Support </li>
          <li className="hover:text-white cursor-pointer">Audit Logs</li>

        </ul>
      </aside>
       {/* Main Content */}
      <div className="w-3/4   p-6">
        <h1 className="text-slate-950 text-2xl font-semibold mb-4">Hello, #Name</h1>
        <p className="text-gray-800">
          Welcome to your dashboard! Here, you can manage your applications, update your profile, and explore job opportunities.
        </p>
      </div>
    </div>
  );
}

