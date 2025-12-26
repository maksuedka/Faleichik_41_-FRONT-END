document.addEventListener("DOMContentLoaded", () => {
    console.log("ЛР 17: Скрипты загружены");

    // ==========================================
    // 1. СОБЫТИЯ МЫШИ (Mouse Events)
    // Реализация: Эффект параллакса на главном баннере
    // ==========================================
    const heroSection = document.querySelector('.hero-banner');
    const heroTitle = document.querySelector('.hero-title');

    if (heroSection && heroTitle) {
        heroSection.addEventListener('mousemove', (e) => {
            // Получаем координаты мыши относительно центра экрана
            const x = (window.innerWidth / 2 - e.pageX) / 20; // Делим на 20, чтобы движение было плавным
            const y = (window.innerHeight / 2 - e.pageY) / 20;

            // Применяем трансформацию к тексту
            heroTitle.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Возвращаем текст на место, когда мышь уходит
        heroSection.addEventListener('mouseleave', () => {
            heroTitle.style.transition = 'transform 0.5s ease';
            heroTitle.style.transform = `translate(0, 0)`;
            
            // Убираем transition после завершения анимации, чтобы mousemove работал без задержек
            setTimeout(() => {
                heroTitle.style.transition = 'none';
            }, 500);
        });
    }

    // ==========================================
    // 2. СОБЫТИЯ ПОЛОСЫ ПРОКРУТКИ (Scroll Events)
    // Реализация: Кнопка "Наверх" и Индикатор прогресса чтения
    // ==========================================
    
    // 2.1 Создаем кнопку "Наверх" динамически
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '▲';
    scrollToTopBtn.id = 'scrollToTopBtn';
    
    // Добавляем стили через JS (чтобы не лезть в CSS файл для лабы)
    Object.assign(scrollToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#FF7F00',
        color: 'white',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'none', // Скрыта по умолчанию
        zIndex: '1000',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        transition: 'opacity 0.3s, transform 0.3s'
    });

    document.body.appendChild(scrollToTopBtn);

    // 2.2 Создаем полосу прогресса чтения (сверху страницы)
    const progressBar = document.createElement('div');
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '5px',
        backgroundColor: '#FF7F00',
        width: '0%',
        zIndex: '9999',
        transition: 'width 0.1s'
    });
    document.body.appendChild(progressBar);

    // Слушатель события скролла
    window.addEventListener('scroll', () => {
        // А) Логика кнопки
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
            setTimeout(() => scrollToTopBtn.style.opacity = '1', 10);
        } else {
            scrollToTopBtn.style.opacity = '0';
            setTimeout(() => scrollToTopBtn.style.display = 'none', 300);
        }

        // Б) Логика прогресс-бара
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // Клик по кнопке - плавный скролл наверх
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================
    // 3. СОБЫТИЯ, СВЯЗАННЫЕ С ТАЙМЕРОМ (Timer Events)
    // Реализация: Всплывающее промо-предложение через 10 секунд
    // ==========================================
    
    // Создаем элемент уведомления
    const promoPopup = document.createElement('div');
    promoPopup.innerHTML = `
        <div style="position: relative;">
            <span id="closePromo" style="position: absolute; top: -10px; right: 0; cursor: pointer; font-size: 20px;">&times;</span>
            <h4 style="margin: 0 0 10px 0; color: #FF7F00;">Специальное предложение!</h4>
            <p style="margin: 0; font-size: 14px;">Запишись сегодня и получи скидку 20% на первый месяц!</p>
        </div>
    `;
    
    Object.assign(promoPopup.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '300px',
        backgroundColor: '#201E1E',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        zIndex: '2000',
        transform: 'translateY(150%)', // Спрятан внизу
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });

    document.body.appendChild(promoPopup);

    // Таймер на появление (через 10 секунд)
    const timerId = setTimeout(() => {
        promoPopup.style.transform = 'translateY(0)';
    }, 10000); // 10000 мс = 10 секунд

    // Закрытие уведомления по крестику
    document.getElementById('closePromo').addEventListener('click', () => {
        promoPopup.style.transform = 'translateY(150%)';
    });


    // ==========================================
    // 4. СОБЫТИЯ КЛАВИАТУРЫ (Keyboard Events)
    // Реализация: Горячие клавиши для навигации
    // Исправлено: Работает на любой раскладке (RU/EN)
    // ==========================================
    
    document.addEventListener('keydown', (event) => {
        // Для отладки: посмотри в консоль (F12), что печатается при нажатии
        console.log(`Нажата клавиша: Code=${event.code}, Shift=${event.shiftKey}`);

        // Shift + клавиша L (физическая) -> Переход на Login
        if (event.shiftKey && event.code === 'KeyL') {
            // event.preventDefault() предотвращает печатание буквы, если фокус в поле ввода
            event.preventDefault(); 
            console.log('Сработало сочетание Shift + L');
            
            // Небольшая задержка или confirm, чтобы пользователь понял, что происходит
            const shouldGo = confirm("Перейти на страницу входа?");
            if (shouldGo) {
                window.location.href = 'login.html';
            }
        }

        // Shift + клавиша H (физическая) -> Переход на Главную (Home)
        if (event.shiftKey && event.code === 'KeyH') {
            event.preventDefault();
            console.log('Сработало сочетание Shift + H');
            window.location.href = 'index.html';
        }

        // Escape -> Закрыть промо-попап
        if (event.code === 'Escape') {
            if (promoPopup) {
                promoPopup.style.transform = 'translateY(150%)';
            }
        }
    });

});