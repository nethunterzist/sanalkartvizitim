export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
        <div className="px-4 py-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Sanal Kartvizit</h2>
          <p className="text-gray-400 text-sm">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 mt-6 px-2">
          <a 
            href="/admin/dashboard" 
            className="flex items-center px-4 py-2 text-gray-300 bg-gray-700 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a 
            href="/admin/firmalar" 
            className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Firmalar
          </a>
          <a 
            href="/admin/icon-settings" 
            className="flex items-center px-4 py-2 mt-2 text-gray-300 hover:bg-gray-700 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            İkon Ayarları
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-700">
              Yardım
            </button>
            <a href="/api/auth/signout" className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700">
              Çıkış Yap
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-800 text-lg font-semibold">Toplam Firma</h2>
              <p className="mt-2 text-3xl font-bold text-gray-700">12</p>
              <p className="text-green-500 text-sm">
                <span className="font-semibold">+5%</span> geçen aya göre
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-800 text-lg font-semibold">Toplam Görüntülenme</h2>
              <p className="mt-2 text-3xl font-bold text-gray-700">1,520</p>
              <p className="text-green-500 text-sm">
                <span className="font-semibold">+12%</span> geçen haftaya göre
              </p>
            </div>
          </div>
        </div>

        {/* İkon Öncelik Sıralaması Ayarları - Bu özellik artık kullanılmıyor */}
        
      </div>
    </div>
  );
} 