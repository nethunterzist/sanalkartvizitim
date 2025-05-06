'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Firma {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: string;
  eposta?: string;
  yetkili_adi?: string;
  goruntulenme?: number;
  created_at: string;
  communication_data?: string;
}

export default function FirmalarPage() {
  const router = useRouter();
  const [firmalar, setFirmalar] = useState<Firma[]>([]);
  const [filteredFirmalar, setFilteredFirmalar] = useState<Firma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  // Debug gösterimi için
  useEffect(() => {
    console.log("Durum değişimi - loading:", loading, "firmalar:", firmalar.length, "error:", error);
  }, [loading, firmalar, error]);
  
  useEffect(() => {
    async function fetchFirmalar() {
      try {
        setLoading(true);
        console.log("Firmalar yükleniyor...");
        
        // API isteği yapılıyor
        const response = await fetch('/api/firmalar');
        console.log("API yanıt durumu:", response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Firmalar getirilirken bir hata oluştu: ${response.status} ${response.statusText}`);
        }
        
        // Veriyi JSON olarak çözümleme
        const responseText = await response.text();
        console.log("API yanıt metni:", responseText);
        
        try {
          const data = JSON.parse(responseText);
          console.log("Çözümlenmiş veri:", data);
          
          if (data && Array.isArray(data.firmalar)) {
            console.log(`${data.firmalar.length} firma bulundu:`, data.firmalar);
            setFirmalar(data.firmalar);
            setFilteredFirmalar(data.firmalar);
          } else {
            console.error("Veri alındı ama firmalar dizisi bulunamadı:", data);
            setError("API yanıtında firma verisi bulunamadı");
          }
        } catch (jsonError) {
          console.error("JSON çözümleme hatası:", jsonError);
          setError("API yanıtı geçerli JSON formatında değil");
          throw jsonError;
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Firma getirme hatası:', err);
        setError(`Firmalar yüklenirken bir hata oluştu: ${err.message}`);
        setLoading(false);
      }
    }
    
    fetchFirmalar();
  }, []);
  
  // Arama işlevi
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFirmalar(firmalar);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = firmalar.filter(firma => 
        firma.firma_adi.toLowerCase().includes(lowercasedSearchTerm) || 
        firma.slug.toLowerCase().includes(lowercasedSearchTerm) ||
        (firma.yetkili_adi && firma.yetkili_adi.toLowerCase().includes(lowercasedSearchTerm)) ||
        (firma.telefon && firma.telefon.toLowerCase().includes(lowercasedSearchTerm)) ||
        (firma.eposta && firma.eposta.toLowerCase().includes(lowercasedSearchTerm))
      );
      setFilteredFirmalar(filtered);
      setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
    }
  }, [searchTerm, firmalar]);
  
  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredFirmalar.length / itemsPerPage);
  const paginatedFirmalar = filteredFirmalar.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Tarihi formatla
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
  
  const handleDelete = async (id: number, firmaAdi: string) => {
    if (!confirm(`"${firmaAdi}" firmasını silmek istediğinize emin misiniz?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/firmalar/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Firma silinirken hata: ${response.status}`);
      }
      
      // Başarıyla silindi, listeyi güncelle
      const updatedFirmalar = firmalar.filter(firma => firma.id !== id);
      setFirmalar(updatedFirmalar);
      setFilteredFirmalar(updatedFirmalar.filter(firma => 
        !searchTerm || 
        firma.firma_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firma.slug.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
    } catch (err) {
      console.error('Firma silinirken hata:', err);
      alert('Firma silinirken bir hata oluştu.');
    }
  };
  
  // Sayfalama bileşeni
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const renderPageButtons = () => {
      const buttons = [];
      const maxButtons = 5; // Maksimum gösterilecek buton sayısı
      
      // İlk sayfa butonu her zaman göster
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded mx-1`}
        >
          1
        </button>
      );
      
      // "..." göstergesi (sol)
      if (currentPage > 3) {
        buttons.push(
          <span key="left-ellipsis" className="px-2">...</span>
        );
      }
      
      // Orta butonlar
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-1 ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded mx-1`}
            >
              {i}
            </button>
          );
        }
      }
      
      // "..." göstergesi (sağ)
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="right-ellipsis" className="px-2">...</span>
        );
      }
      
      // Son sayfa butonu (1'den farklıysa)
      if (totalPages > 1) {
        buttons.push(
          <button
            key="last"
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-1 ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded mx-1`}
          >
            {totalPages}
          </button>
        );
      }
      
      return buttons;
    };
    
    return (
      <div className="flex justify-center items-center mt-4 mb-6 space-x-1">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          &laquo; Önceki
        </button>
        
        {renderPageButtons()}
        
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Sonraki &raquo;
        </button>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
        <div className="px-4 py-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Yönetim Paneli</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Genel Bakış
          </Link>
          
          <Link
            href="/admin/firmalar"
            className="flex items-center px-4 py-2 text-sm rounded-md bg-gray-700 text-white"
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
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Firmalar
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
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
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-lg font-medium text-gray-900">Firma Listesi</h2>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-grow md:max-w-xs">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Firma adı, slug, yetkili..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <Link 
                  href="/admin/firmalar/yeni" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Yeni Firma Ekle
                </Link>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-gray-500">Yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredFirmalar.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-4">
                <p className="text-gray-500">
                  {searchTerm ? `"${searchTerm}" ile eşleşen firma bulunamadı.` : "Henüz firma bulunmuyor."}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Firma Adı
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Firma Yetkilisi
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefon
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Görüntülenme
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedFirmalar.map((firma) => (
                          <tr key={firma.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {firma.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{firma.firma_adi}</div>
                              <div className="text-sm text-gray-500">Slug: {firma.slug}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {firma.yetkili_adi || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(firma.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                <button
                                  onClick={() => handleDelete(firma.id, firma.firma_adi)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Sil"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Sayfalama */}
                <Pagination />
                
                {/* Sonuç bilgisi */}
                <div className="mt-4 text-sm text-gray-500">
                  {filteredFirmalar.length > 0 ? (
                    <p>
                      Toplam {filteredFirmalar.length} firma bulundu.
                      {searchTerm && ` "${searchTerm}" aramasıyla eşleşen ${filteredFirmalar.length} firma gösteriliyor.`}
                      {` Sayfa ${currentPage}/${totalPages}`}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 