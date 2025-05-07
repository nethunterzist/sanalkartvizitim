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
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="row justify-content-center" id="icons-container">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`; 