export const cardTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{firma_adi}} - Dijital Kartvizit</title>
    <link rel="icon" href="https://sanalkartvizitim.com/wp-content/uploads/2024/03/fav.png" type="image/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-y: auto;
            background-color: #f8f9fa;
        }
        .main-container {
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
            position: relative;
            min-height: 100vh;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            background-color: white;
        }
        .background {
            background: url('/img/back.jpeg') no-repeat center center;
            background-size: cover;
            width: 100%;
            height: auto;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .card-content {
            text-align: center;
            width: 90%;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px 0;
        }
        .profile-image {
            width: 300px;
            height: 300px;
            margin: 20px auto;
            border-radius: 50%;
            object-fit: cover;
            border: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            background: linear-gradient(135deg, #FFD700, #b8860b);
            padding: 5px;
            position: relative;
        }
        .profile-image::after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: linear-gradient(135deg, #FFD700, #b8860b);
            border-radius: 50%;
            z-index: -1;
        }
        .profile-container {
            position: relative;
            width: 300px;
            height: 300px;
            margin: 0 auto 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .profile-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #FFD700, #b8860b);
            z-index: -1;
            border-radius: 50%;
            transform: scale(1.1);
        }
        .icon img {
            width: 100%;
            max-width: 70px;
            margin: 10px 0;
        }
        .icon-label {
            font-size: 14px;
            color: #333;
            margin-top: 5px;
            word-break: break-word;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .icon a {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
        }
        .social-media {
            margin-top: 15px;
            display: flex;
            justify-content: space-around;
        }
        .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #336B87;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .social-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.2);
            background-color: #90AFC5;
        }
        .social-link img {
            width: 20px;
            height: 20px;
            filter: brightness(0) invert(1);
        }
        .custom-popup-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .custom-popup-content {
            background: #fff;
            border-radius: 12px;
            padding: 32px 24px 24px 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            position: relative;
            animation: popupIn 0.2s;
        }
        @keyframes popupIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .custom-popup-close {
            position: absolute;
            top: 12px;
            right: 16px;
            background: none;
            border: none;
            font-size: 2rem;
            color: #888;
            cursor: pointer;
            transition: color 0.2s;
        }
        .custom-popup-close:hover {
            color: #c00;
        }
        .tax-info div {
            margin-bottom: 10px;
            font-size: 1rem;
            color: #222;
        }
        .about-content {
            font-size: 1rem;
            color: #222;
            line-height: 1.6;
            margin-top: 10px;
            word-break: break-word;
        }
        .copy-btn {
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 8px;
            padding: 2px;
            vertical-align: middle;
        }
        .copy-icon {
            width: 18px;
            height: 18px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .copy-btn:hover .copy-icon {
            opacity: 1;
        }
        .bank-accounts-list {
            margin-top: 10px;
            max-height: 60vh;
            overflow-y: auto;
        }
        .bank-card {
            background: #fafbfc;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            padding: 16px 14px;
            margin-bottom: 18px;
        }
        .iban-text {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 6px 8px;
            font-family: monospace;
            font-size: 0.98em;
            width: 100%;
            outline: none;
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="background">
            <div class="card-content">
                <div class="profile-container">
                    {{#if profil_foto}}
                    <img src="{{profil_foto}}" class="profile-image" alt="{{firma_adi}}">
                    {{else}}
                    <img src="/img/profile-default.png" class="profile-image" alt="{{firma_adi}}">
                    {{/if}}
                </div>

                <div class="container">
                    <div class="row justify-content-center mb-2">
                        <div class="col-12 text-center">
                            <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; color: #000;">{{firma_adi}}</h1>
                            {{#if yetkili_adi}}
                            <h1 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 5px; color: #000;">{{yetkili_adi}}</h1>
                            {{/if}}
                            {{#if yetkili_pozisyon}}
                            <p style="font-size: 1rem; color: #666;">{{yetkili_pozisyon}}</p>
                            {{/if}}
                            <div style="display: flex; flex-direction: column; align-items: center; margin-top: 8px;">
                                <a href="/{{slug}}/{{slug}}.vcf" download="{{firma_adi}}.vcf" style="display: flex; align-items: center; gap: 6px; background: none; border-radius: 0; padding: 0; font-size: 15px; color: #222; text-decoration: none; box-shadow: none; margin-top: 2px;">
                                    <img src="/img/rehber.png" alt="Rehbere Ekle" style="width: 28px; height: 28px; margin: 0; padding: 0; background: none; border: none; box-shadow: none;" />
                                    <span>Rehbere Ekle</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="row justify-content-center mb-3">
                        <!-- QR kod ikonu buradan kaldırıldı, sadece ikonlar arasında olacak -->
                    </div>
                </div>

                <div class="container">
                    <div class="row justify-content-center" id="icons-container">
                        <div class="col-3 icon">
                            <a href="/{{slug}}/qr" target="_blank" rel="noopener noreferrer" class="d-flex flex-column align-items-center text-decoration-none">
                                <img src="/img/qrcode.png" alt="QR Kod">
                                <span class="mt-1 text-center small icon-label">QR Kod</span>
                            </a>
                        </div>
                        {{#if social_media}}
                            {{#each social_media}}
                            <div class="col-3 icon">
                                <a href="{{this.url}}" target="_blank" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{this.icon}}" alt="{{this.label}}">
                                    <span class="mt-1 text-center small icon-label">{{this.label}}</span>
                                </a>
                            </div>
                            {{/each}}
                        {{/if}}
                        
                        {{#if communication}}
                            {{#each communication}}
                            <div class="col-3 icon">
                                <a href="{{this.url}}" target="_blank" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{this.icon}}" alt="{{this.label}}">
                                    <span class="mt-1 text-center small icon-label">{{this.label}}</span>
                                </a>
                            </div>
                            {{/each}}
                        {{/if}}

                        {{#if katalog}}
                            <div class="col-3 icon">
                                <a href="{{katalog.url}}" target="_blank" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{katalog.icon}}" alt="{{katalog.label}}">
                                    <span class="mt-1 text-center small icon-label">{{katalog.label}}</span>
                                </a>
                            </div>
                        {{/if}}
                        {{#if iban}}
                            <div class="col-3 icon">
                                <a href="#" onclick="showBankPopup(event)" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{iban.icon}}" alt="{{iban.label}}">
                                    <span class="mt-1 text-center small icon-label">{{iban.label}}</span>
                                </a>
                            </div>
                        {{/if}}
                        {{#if tax}}
                            <div class="col-3 icon">
                                <a href="#" onclick="showTaxPopup(event)" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{tax.icon}}" alt="{{tax.label}}">
                                    <span class="mt-1 text-center small icon-label">{{tax.label}}</span>
                                </a>
                            </div>
                        {{/if}}
                        {{#if about}}
                            <div class="col-3 icon">
                                <a href="#" onclick="showAboutPopup(event)" class="d-flex flex-column align-items-center text-decoration-none">
                                    <img src="{{about.icon}}" alt="{{about.label}}">
                                    <span class="mt-1 text-center small icon-label">{{about.label}}</span>
                                </a>
                            </div>
                        {{/if}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Vergi Bilgileri Popup -->
    <div id="tax-popup" class="custom-popup-overlay" style="display:none;">
        <div class="custom-popup-content">
            <button class="custom-popup-close" onclick="closeTaxPopup()">&times;</button>
            <h2>Vergi Bilgileri</h2>
            <div class="tax-info">
                <div><b>Firma Ünvanı:</b> {{tax.firma_unvan}}
                    <button class="copy-btn" onclick="copyToClipboard('{{tax.firma_unvan}}', event)" title="Kopyala"><img src='/img/paylas.png' class='copy-icon'></button>
                </div>
                <div><b>Vergi Numarası:</b> {{tax.firma_vergi_no}}
                    <button class="copy-btn" onclick="copyToClipboard('{{tax.firma_vergi_no}}', event)" title="Kopyala"><img src='/img/paylas.png' class='copy-icon'></button>
                </div>
                <div><b>Vergi Dairesi:</b> {{tax.vergi_dairesi}}
                    <button class="copy-btn" onclick="copyToClipboard('{{tax.vergi_dairesi}}', event)" title="Kopyala"><img src='/img/paylas.png' class='copy-icon'></button>
                </div>
            </div>
        </div>
    </div>
    <!-- Hakkımızda Popup -->
    <div id="about-popup" class="custom-popup-overlay" style="display:none;">
        <div class="custom-popup-content">
            <button class="custom-popup-close" onclick="closeAboutPopup()">&times;</button>
            <h2>Hakkımızda</h2>
            <div class="about-content">{{about.content}}</div>
        </div>
    </div>

    <!-- Banka Hesapları Popup -->
    <div id="bank-popup" class="custom-popup-overlay" style="display:none;">
        <div class="custom-popup-content" style="max-width: 500px; width: 95%;">
            <button class="custom-popup-close" onclick="closeBankPopup()">&times;</button>
            <h2>Banka Hesapları</h2>
            <div class="bank-accounts-list">
                {{#if iban.value}}
                    {{#each (parseBankAccounts iban.value) as |bank|}}
                        <div class="bank-card">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                {{#if bank.bank_logo}}
                                    <img src="{{bank.bank_logo}}" alt="{{bank.bank_label}}" style="width: 36px; height: 36px; object-fit: contain; margin-right: 10px;">
                                {{/if}}
                                <div>
                                    <div style="font-weight: bold;">{{bank.bank_label}}</div>
                                    <div style="font-size: 0.95em; color: #666;">{{bank.account_holder}}</div>
                                </div>
                            </div>
                            {{#each bank.accounts}}
                                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                    <span style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #FFD700, #b8860b); color: #fff; font-weight: bold; display: flex; align-items: center; justify-content: center; margin-right: 8px;">
                                        {{#if this.currency}}
                                            {{#ifEquals this.currency "TL"}}₺{{/ifEquals}}
                                            {{#ifEquals this.currency "TRY"}}₺{{/ifEquals}}
                                            {{#ifEquals this.currency "USD"}}&#36;{{/ifEquals}}
                                            {{#ifEquals this.currency "EUR"}}€{{/ifEquals}}
                                        {{else}}
                                            ₺
                                        {{/if}}
                                    </span>
                                    <input type="text" class="iban-text" value="{{this.iban}}" readonly style="flex:1; padding: 6px 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 0.98em; margin-right: 6px;">
                                    <button class="copy-btn" onclick="copyToClipboard('{{this.iban}}', event)" title="Kopyala"><img src='/img/paylas.png' class='copy-icon'></button>
                                </div>
                            {{/each}}
                        </div>
                    {{/each}}
                {{else}}
                    <div style="text-align:center; color:#888;">Tanımlı banka hesabı bulunamadı.</div>
                {{/if}}
            </div>
        </div>
    </div>

    <script>
    function showTaxPopup(e) {
        e.preventDefault();
        document.getElementById('tax-popup').style.display = 'flex';
    }
    function closeTaxPopup() {
        document.getElementById('tax-popup').style.display = 'none';
    }
    function showAboutPopup(e) {
        e.preventDefault();
        document.getElementById('about-popup').style.display = 'flex';
    }
    function closeAboutPopup() {
        document.getElementById('about-popup').style.display = 'none';
    }
    function copyToClipboard(text, event) {
        event.preventDefault();
        if (!text) return;
        navigator.clipboard.writeText(text).then(function() {
            const btn = event.currentTarget;
            btn.style.opacity = '0.5';
            setTimeout(() => { btn.style.opacity = '1'; }, 700);
        });
    }
    function showBankPopup(e) {
        e.preventDefault();
        document.getElementById('bank-popup').style.display = 'flex';
    }
    function closeBankPopup() {
        document.getElementById('bank-popup').style.display = 'none';
    }
    // Handlebars helper: JSON stringi parse et
    if (typeof Handlebars !== 'undefined') {
        Handlebars.registerHelper('parseBankAccounts', function(jsonStr) {
            try { return JSON.parse(jsonStr); } catch { return []; }
        });
    }
    </script>
</body>
</html>`; 