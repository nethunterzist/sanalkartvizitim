'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Firma {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: string;
  eposta?: string;
  website?: string;
  yetkili_adi?: string;
  goruntulenme?: number;
  created_at: string;
  communication_data?: string;
}

// Tema türlerini tanımlayan enum
type ThemeType = 'light' | 'dark';

// Kullanıcı ayarları için interface
interface UserSettings {
  theme: ThemeType;
  listViewSize: number;
}

export default function AdminDashboard() {
  const [firmaCount, setFirmaCount] = useState(0);
  const [sonEklenenFirmalar, setSonEklenenFirmalar] = useState<Firma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Kullanıcı ayarları
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    listViewSize: 5
  });

  useEffect(() => {
    // Local storage'dan ayarları yükle
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Ayarlar yüklenirken hata oluştu:', err);
      }
    }
  }, []);

  // Ayarları kaydet
  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
    setShowSettings(false);
  };

  useEffect(() => {
    async function fetchFirmalar() {
      try {
        setLoading(true);
        // API'den firma verilerini al
        const response = await fetch('/api/firmalar');
        
        if (!response.ok) {
          throw new Error(`HTTP hata: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Genel bakış - alınan firma verileri:', data);
        
        if (data && data.firmalar) {
          // Firma sayısını ayarla
          setFirmaCount(data.firmalar.length);
          
          // Son eklenen firmaları ayarlanmış sayı kadar al
          const siraliList = [...data.firmalar]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, settings.listViewSize);
          
          setSonEklenenFirmalar(siraliList);
        } else {
          throw new Error('Firma verileri alınamadı');
        }
      } catch (err) {
        console.error('Firmalar alınırken hata oluştu:', err);
        setError('Firmalar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchFirmalar();
  }, [settings.listViewSize]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Firma linkini kopyala
  const copyFirmaLink = (slug: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/${slug}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        alert(`Link kopyalandı: ${link}`);
      })
      .catch(err => {
        console.error('Link kopyalanırken hata oluştu:', err);
      });
  };
  
  // Ayarlar Modal Bileşeni
  const SettingsModal = () => {
    if (!showSettings) return null;
    
    const [tempSettings, setTempSettings] = useState<UserSettings>({...settings});
    
    const updateSetting = (key: keyof UserSettings, value: any) => {
      setTempSettings({...tempSettings, [key]: value});
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Panel Ayarları</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <select
                value={tempSettings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listede Gösterilecek Firma Sayısı</label>
              <select
                value={tempSettings.listViewSize}
                onChange={(e) => updateSetting('listViewSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3">3 Firma</option>
                <option value="5">5 Firma</option>
                <option value="10">10 Firma</option>
                <option value="15">15 Firma</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              onClick={() => saveSettings(tempSettings)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`flex h-screen ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${settings.theme === 'dark' ? 'bg-gray-900 border-r border-gray-700' : 'bg-gray-800'} text-white w-64 min-h-screen flex flex-col`}>
        <div className="px-4 py-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Yönetim Paneli</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-sm rounded-md bg-gray-900 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Genel Bakış
          </Link>
          
          <Link
            href="/admin/firmalar"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Firmalar
          </Link>
          
          <Link
            href="/admin/firmalar/yeni"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Firma Ekle
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          <p>© 2023 Sanal Kartvizit</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
        {/* Header */}
        <header className={`${settings.theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'} shadow`}>
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className={`text-xl font-semibold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Sanal Kartvizit Yönetim Paneli
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className={`flex items-center text-sm ${settings.theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} focus:outline-none`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ayarlar
              </button>
              <span className={`text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Hoş geldiniz, Admin
              </span>
              <Link 
                href="/login"
                className="text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none"
              >
                Çıkış Yap
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main */}
        <main className={`flex-1 overflow-y-auto ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
          <div className="max-w-7xl mx-auto">
            <div className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Genel Bakış</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-lg p-4 ${settings.theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>Toplam Firma</h3>
                  <p className="text-3xl font-bold mt-2">{firmaCount}</p>
                </div>
              </div>
            </div>
            
            <div className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow rounded-lg p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Son Eklenen Firmalar</h2>
                <Link 
                  href="/admin/firmalar" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Tümünü Görüntüle
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center py-10">
                  <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Yükleniyor...</p>
                </div>
              ) : error ? (
                <div className={`text-center py-10 ${settings.theme === 'dark' ? 'bg-red-900' : 'bg-red-50'} rounded-lg`}>
                  <p className={`${settings.theme === 'dark' ? 'text-red-200' : 'text-red-500'}`}>{error}</p>
                </div>
              ) : sonEklenenFirmalar.length === 0 ? (
                <div className={`text-center py-10 ${settings.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Henüz firma kaydı bulunmamaktadır.</p>
                  <Link 
                    href="/admin/firmalar/yeni" 
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Yeni Firma Ekle
                  </Link>
                </div>
              ) : (
                <div className={`overflow-hidden rounded-lg border ${settings.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          ID
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Firma Adı
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Firma Yetkilisi
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Telefon
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Tarih
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Görüntülenme
                        </th>
                        <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-white'} divide-y ${settings.theme === 'dark' ? 'divide-gray-600' : 'divide-gray-200'}`}>
                      {sonEklenenFirmalar.map((firma) => (
                        <tr key={firma.id}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                            {firma.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{firma.firma_adi}</div>
                            <div className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Slug: {firma.slug}</div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {firma.yetkili_adi || "-"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {(() => {
                              try {
                                // communication_data'yı parse edip ilk telefonu alıyoruz
                                if (firma.communication_data) {
                                  const commData = JSON.parse(firma.communication_data);
                                  if (commData.telefonlar && commData.telefonlar.length > 0) {
                                    return commData.telefonlar[0].value;
                                  }
                                }
                                // Eski yöntemi yedek olarak kullan
                                return firma.telefon || "-";
                              } catch (e) {
                                console.error("Telefon gösterilirken hata:", e);
                                return firma.telefon || "-";
                              }
                            })()}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {formatDate(firma.created_at)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {firma.goruntulenme || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => copyFirmaLink(firma.slug)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Linki kopyala"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                              </button>
                              <Link 
                                href={`/${firma.slug}`} 
                                target="_blank"
                                className="text-blue-600 hover:text-blue-900"
                                title="Görüntüle"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </Link>
                              <Link 
                                href={`/admin/firmalar/${firma.id}`}
                                className="text-amber-600 hover:text-amber-900"
                                title="Düzenle"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Ayarlar Modal */}
      <SettingsModal />
    </div>
  );
} 