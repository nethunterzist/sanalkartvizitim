import React, { useEffect } from 'react';

// Firma tipi tanımı
interface Firma {
  id: number;
  firma_adi: string;
  slug: string;
  [key: string]: any; // Diğer alanlar için genel tip
}

export default function FirmaSayfasi({ firma }: { firma: Firma }) {
  
  useEffect(() => {
    // Sayfa yüklendiğinde görüntülenme sayısını artır
    const incrementViewCount = async () => {
      try {
        await fetch(`/api/firmalar/${firma.id}`, {
          method: 'GET',
          headers: {
            'X-Increment-View': 'true'
          }
        });
        console.log('Görüntülenme sayısı artırıldı');
      } catch (error) {
        console.error('Görüntülenme sayısı artırılırken hata:', error);
      }
    };
    
    incrementViewCount();
  }, [firma.id]);
} 