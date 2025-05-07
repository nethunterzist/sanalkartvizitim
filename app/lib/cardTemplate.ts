const cardTemplate = `
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
        .contact-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .social-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }
        .social-link {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            background-color: #f8f9fa;
            border-radius: 25px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
        }
        .social-link:hover {
            background-color: #e9ecef;
            transform: translateY(-2px);
        }
        .social-link i {
            margin-right: 10px;
            font-size: 20px;
        }
        .rehber-icon img {
            width: 100%;
            max-width: none;
            transform: scale(3.3);
            margin: 10px 0;
        }
        .icon img {
            width: 100%;
            max-width: 70px;
            margin: 10px 0;
        }
        .logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 20px;
        }
        .rizanka-logo {
            border-right: 1px solid #666;
            padding-right: 10px;
        }
        .logos img {
            max-width: 100px;
            height: auto;
        }
        .youtube-section {
            margin-top: -40px;
            text-align: center;
        }
        .youtube-section img {
            width: 100%;
            max-width: 120px;
            margin: 0 auto;
        }
        .share-menu {
            position: fixed;
            bottom: -400px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 450px;
            background-color: #fff;
            box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            transition: bottom 0.3s ease-in-out;
            padding: 20px;
            text-align: center;
        }
        .share-menu.open {
            bottom: 0;
        }
        .share-menu h3 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .share-menu .icon-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-bottom: 20px;
        }
        .share-menu .icon-container i {
            font-size: 30px;
            background-color: #f2f2f2;
            border-radius: 50%;
            padding: 15px;
            color: #555;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        .share-menu .icon-container i:hover {
            transform: scale(1.1);
            background-color: #e0e0e0;
        }
        .share-menu .divider {
            border-top: 1px solid #e0e0e0;
            margin: 20px 0;
        }
        .share-menu .copy-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            color: #000;
        }
        .share-menu .copy-link i {
            font-size: 18px;
            background-color: #f2f2f2;
            border-radius: 50%;
            padding: 10px;
            color: #555;
        }
        .copy-link:hover i {
            background-color: #e0e0e0;
        }
        /* ... (devamı: index-template.html'ün tamamı buraya eklenecek) ... */
    </style>
</head>
<body>
    <div class="main-container">
        <div class="background">
            <div class="card-content">
                {{#if firma_logo}}
                <div class="profile-container">
                    <img src="{{firma_logo}}" alt="{{firma_adi}}" class="profile-image">
                </div>
                {{/if}}
                
                <h1>{{firma_adi}}</h1>
                {{#if yetkili_adi}}
                <h2>{{yetkili_adi}}</h2>
                {{/if}}
                {{#if yetkili_pozisyon}}
                <p>{{yetkili_pozisyon}}</p>
                {{/if}}

                {{#if communication}}
                <div class="contact-info">
                    <h3>İletişim Bilgileri</h3>
                    {{#each communication}}
                    <p>
                        <strong>{{this.tip}}:</strong> {{this.deger}}
                        {{#if this.label}}({{this.label}}){{/if}}
                    </p>
                    {{/each}}
                </div>
                {{/if}}

                {{#if social_media}}
                <div class="social-links">
                    {{#each social_media}}
                    <a href="{{this.url}}" target="_blank" class="social-link">
                        <i class="fab fa-{{this.platform}}"></i>
                        {{this.platform}}
                        {{#if this.label}}({{this.label}}){{/if}}
                    </a>
                    {{/each}}
                </div>
                {{/if}}

                {{#if website}}
                <div class="contact-info">
                    <h3>Web Siteleri</h3>
                    {{#each website}}
                    <p><a href="{{this}}" target="_blank">{{this}}</a></p>
                    {{/each}}
                </div>
                {{/if}}
            </div>
        </div>
    </div>
</body>
</html>`;

export default cardTemplate; 