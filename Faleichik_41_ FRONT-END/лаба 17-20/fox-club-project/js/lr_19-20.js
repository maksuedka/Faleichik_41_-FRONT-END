document.addEventListener("DOMContentLoaded", () => {
    // Проверка загрузки
    console.log("%c[Система]: Скрипт загружен успешно", "color: #00ff00; font-weight: bold;");

    const setCookie = (name, value, days = 7) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            // Если мы зашли сюда — браузерная валидация пройдена
            console.log("Форма отправлена, начинаем обработку...");
            
            try {
                e.preventDefault(); 

                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                // Валидация
                if (firstName.trim().length < 2 || password.length < 6) {
                    alert("Ошибка: Имя < 2 симв. или Пароль < 6 симв.");
                    return;
                }

                // Данные
                const userObj = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    time: new Date().toISOString()
                };

                const userJSON = JSON.stringify(userObj);
                console.log("JSON для сохранения:", userJSON);

                // Сохранение
                localStorage.setItem('userFirstName', firstName);
                localStorage.setItem('cached_user_json', userJSON);
                setCookie('user_profile_data', userJSON, 7);

                console.log("Все данные сохранены в LS и Cookies");

                // Сначала алерт, потом переход
                alert("Данные успешно сохранены в LocalStorage, Cookies и JSON!\nНажмите ОК для перехода в профиль.");

                window.location.href = 'profile.html';

            } catch (err) {
                // Если код упадет — мы увидим это в алерте
                console.error(err);
                alert("Критическая ошибка в скрипте: " + err.message);
            }
        });
    }

    // Логика профиля
    if (window.location.pathname.includes('profile.html')) {
        const nameSpan = document.getElementById('profileUserName');
        const savedName = localStorage.getItem('userFirstName');
        if (nameSpan && savedName) {
            nameSpan.textContent = savedName;
        }
        
        const cookieData = getCookie('user_profile_data');
        if (cookieData) {
            console.log("Найден JSON в Cookies:", JSON.parse(cookieData));
        }
    }
});