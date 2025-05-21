"use client";
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const [modal, setModal] = useState<null | 'terms' | 'privacy'>(null);
  return (
    <footer className="w-full bg-white pt-12 pb-4 px-4 md:px-0 border-0 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Logo ve Marka Adı */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              {/* Logo placeholder */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#2563eb"/><rect x="6" y="6" width="12" height="12" rx="2" fill="#fff"/></svg>
            </span>
            <span className="font-bold text-2xl text-gray-900">Sanalkartvizitim</span>
          </div>
          <p className="text-gray-500 text-base max-w-xl mb-4">Sanalkartvizitim, dijital kartvizit ve QR çözümleriyle işinizi modern, hızlı ve güvenli şekilde dijitalleştirir. Tüm iletişim ve tanıtım araçlarınızı tek bir platformda birleştirir.</p>
        </div>
        {/* Sosyal Medya İkonları */}
        <div className="flex gap-6 justify-center mb-8">
          <a href="#" className="text-gray-900 hover:text-red-600 text-2xl transition" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" className="text-gray-900 hover:text-pink-600 text-2xl transition" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="text-gray-900 hover:text-blue-600 text-2xl transition" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" className="text-gray-900 hover:text-black text-2xl transition" aria-label="X"><FaXTwitter /></a>
        </div>
      </div>
      {/* Alt çizgi */}
      <div className="w-full border-t border-gray-200 my-4" />
      {/* Alt Bilgi ve Linkler */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-700 text-sm px-2">
        <div className="mb-2 md:mb-0">© 2025 Sanalkartvizitim. Tüm hakları saklıdır.</div>
        <div className="flex gap-4">
          <button onClick={() => setModal('terms')} className="hover:text-blue-600 transition bg-transparent border-0 p-0 m-0 cursor-pointer">Kullanım Koşulları</button>
          <span className="hidden md:inline">|</span>
          <button onClick={() => setModal('privacy')} className="hover:text-blue-600 transition bg-transparent border-0 p-0 m-0 cursor-pointer">Gizlilik Politikası</button>
        </div>
      </div>
      {/* Modal Popup */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 relative max-h-[70vh] overflow-y-auto">
            <button onClick={() => setModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 text-2xl">&times;</button>
            {modal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Kullanım Koşulları</h3>
                <p className="text-gray-700 text-sm mb-2">Sanalkartvizitim platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen bu koşulları dikkatlice okuyunuz.</p>
                <ol className="list-decimal pl-5 text-gray-700 text-sm mb-2 space-y-2">
                  <li><b>Hizmet Tanımı:</b> Sanalkartvizitim, dijital kartvizit oluşturma, paylaşma ve yönetme hizmeti sunar. Platformda sunulan tüm özellikler, kullanıcıların profesyonel ve kurumsal iletişimlerini kolaylaştırmak amacıyla geliştirilmiştir.</li>
                  <li><b>Kullanıcı Sorumluluğu:</b> Kullanıcılar, platformda oluşturdukları ve paylaştıkları tüm içeriklerden kendileri sorumludur. Yanıltıcı, yasa dışı, zararlı veya üçüncü şahıs haklarını ihlal eden içeriklerin paylaşılması yasaktır.</li>
                  <li><b>Hesap Güvenliği:</b> Kullanıcılar, hesap bilgilerinin gizliliğinden ve güvenliğinden sorumludur. Hesaplarının izinsiz kullanımı durumunda derhal platform yönetimine bildirimde bulunmalıdır.</li>
                  <li><b>Fikri Mülkiyet:</b> Platformda sunulan tüm yazılım, tasarım, marka ve içeriklerin tüm hakları Sanalkartvizitim'e aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya dağıtılamaz.</li>
                  <li><b>Hizmetin Sürekliliği:</b> Sanalkartvizitim, hizmetin kesintisiz ve hatasız sunulması için azami çaba gösterir; ancak teknik nedenlerle geçici erişim kesintileri yaşanabilir.</li>
                  <li><b>Ücretlendirme ve Değişiklikler:</b> Platformda sunulan bazı hizmetler ücretli olabilir. Fiyatlandırma ve hizmet koşulları önceden bildirilmek kaydıyla değiştirilebilir.</li>
                  <li><b>Üçüncü Taraf Bağlantıları:</b> Platformda üçüncü taraf sitelere veya servislere yönlendiren bağlantılar bulunabilir. Bu sitelerin içerik ve güvenliğinden Sanalkartvizitim sorumlu değildir.</li>
                  <li><b>Hesap İptali:</b> Kullanıcılar diledikleri zaman hesaplarını kapatabilir. Hesap kapatıldığında, kullanıcıya ait veriler yasal zorunluluklar dışında silinir.</li>
                  <li><b>Değişiklik Hakkı:</b> Sanalkartvizitim, kullanım koşullarını ve politikalarını önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutar. Güncel koşullar platformda yayımlandığı andan itibaren geçerlidir.</li>
                  <li><b>İletişim:</b> Her türlü soru ve talepleriniz için iletişim formu veya destek e-posta adresi üzerinden bize ulaşabilirsiniz.</li>
                </ol>
                <p className="text-gray-600 text-xs">Bu koşullar, yürürlükteki yasalara tabidir. Platformu kullanmaya devam ederek bu koşulları kabul etmiş sayılırsınız.</p>
              </div>
            )}
            {modal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Gizlilik Politikası</h3>
                <p className="text-gray-700 text-sm mb-2">Sanalkartvizitim olarak kişisel verilerinizin gizliliğine ve güvenliğine büyük önem veriyoruz. Aşağıda, verilerinizin nasıl işlendiği ve korunduğu detaylı şekilde açıklanmıştır.</p>
                <ol className="list-decimal pl-5 text-gray-700 text-sm mb-2 space-y-2">
                  <li><b>Toplanan Veriler:</b> Ad, soyad, e-posta, telefon, firma bilgileri, profil fotoğrafı, sosyal medya linkleri ve diğer kartvizit içerikleri gibi bilgiler toplanabilir.</li>
                  <li><b>Veri Kullanımı:</b> Toplanan veriler, yalnızca hizmetin sunulması, kullanıcı deneyiminin iyileştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır.</li>
                  <li><b>Veri Paylaşımı:</b> Kişisel verileriniz, açık rızanız olmadan üçüncü kişilerle paylaşılmaz. Yasal zorunluluklar ve hizmetin gerektirdiği teknik iş ortakları hariç tutulur.</li>
                  <li><b>Veri Güvenliği:</b> Verileriniz, modern güvenlik teknolojileriyle korunur. Yetkisiz erişim, kayıp veya kötüye kullanım riskine karşı gerekli tüm teknik ve idari önlemler alınır.</li>
                  <li><b>Çerezler ve Takip Teknolojileri:</b> Platformda kullanıcı deneyimini geliştirmek için çerezler ve benzeri teknolojiler kullanılabilir. Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz.</li>
                  <li><b>Veri Saklama Süresi:</b> Kişisel verileriniz, hizmetten yararlandığınız sürece ve yasal saklama süreleri boyunca muhafaza edilir. Hesap silindiğinde verileriniz makul süre içinde silinir veya anonimleştirilir.</li>
                  <li><b>Haklarınız:</b> Kişisel verilerinizle ilgili erişim, düzeltme, silme, işleme kısıtlama ve itiraz haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.</li>
                  <li><b>Üçüncü Taraf Servisler:</b> Platformda üçüncü taraf servisler veya entegrasyonlar kullanılabilir. Bu servislerin gizlilik politikalarından Sanalkartvizitim sorumlu değildir.</li>
                  <li><b>Politika Değişiklikleri:</b> Gizlilik politikası zaman zaman güncellenebilir. Güncel politika platformda yayımlandığı andan itibaren geçerlidir.</li>
                  <li><b>İletişim:</b> Gizlilik ve veri koruma ile ilgili tüm sorularınız için destek ekibimize ulaşabilirsiniz.</li>
                </ol>
                <p className="text-gray-600 text-xs">Bu politika, yürürlükteki KVKK ve ilgili diğer yasalara tabidir. Platformu kullanmaya devam ederek gizlilik politikasını kabul etmiş sayılırsınız.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Yukarı Çık Butonu */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed md:absolute bottom-6 right-6 md:right-8 w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center bg-white text-blue-500 hover:bg-blue-50 shadow transition z-50"
        aria-label="Yukarı Çık"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="10" stroke="#2563eb" strokeWidth="1.5" fill="none"/><path d="M8 13l4-4 4 4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </footer>
  );
} 