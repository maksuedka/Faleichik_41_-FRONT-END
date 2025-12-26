document.addEventListener("DOMContentLoaded", () => {
    console.log("ЛР 18: Финальная версия валидации активна");

    const loginForm = document.getElementById('loginForm');
    
    // Если формы нет (например, мы на другой странице), останавливаем скрипт
    if (!loginForm) return;

    // === 1. ПАТТЕРНЫ (REGEX) ===
    const patterns = {
        // Имя: Буквы (рус/англ), дефис, пробел. Длина 2-20.
        name: /^[a-zA-Zа-яА-ЯёЁ\s-]{2,20}$/,

        // Email: Стандартная проверка
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

        // Пароль: Мин 6 символов, МИНИМУМ 1 цифра И 1 буква
        password: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/
    };

    const messages = {
        name: "Только буквы. От 2 до 20 символов.",
        email: "Некорректный email (нужна @ и точка).",
        password: "Мин. 6 символов. Нужна хотя бы 1 цифра и 1 буква (лат)."
    };

    // === 2. ФУНКЦИЯ ПРОВЕРКИ ПОЛЯ ===
    function validateField(input, regex, errorMsgId) {
        const value = input.value.trim();
        const errorElement = document.getElementById(errorMsgId);
        
        let isValid = true;

        // Проверка 1: Пустота
        if (value === '') {
            errorElement.textContent = "Поле не может быть пустым";
            input.style.borderColor = "red";
            isValid = false;
        } 
        // Проверка 2: Регулярное выражение
        else if (!regex.test(value)) {
            // Выбираем текст ошибки
            if (input.id.includes('Name')) errorElement.textContent = messages.name;
            else if (input.id === 'email') errorElement.textContent = messages.email;
            else if (input.id === 'password') errorElement.textContent = messages.password;
            
            input.style.borderColor = "red";
            isValid = false;
        } 
        // Успех
        else {
            errorElement.textContent = "";
            input.style.borderColor = "#28a745"; // Зеленый
            isValid = true;
        }

        return isValid;
    }

    // === 3. ЖИВАЯ ПРОВЕРКА (BLUR) ===
    const fields = [
        { id: 'firstName', regex: patterns.name, errorId: 'firstNameError' },
        { id: 'lastName',  regex: patterns.name, errorId: 'lastNameError' },
        { id: 'email',     regex: patterns.email, errorId: 'emailError' },
        { id: 'password',  regex: patterns.password, errorId: 'passwordError' }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            // Проверка при уходе с поля
            input.addEventListener('blur', () => {
                validateField(input, field.regex, field.errorId);
            });
            // Очистка ошибки при вводе
            input.addEventListener('input', () => {
                input.style.borderColor = "#ddd";
                document.getElementById(field.errorId).textContent = "";
            });
        }
    });

    // === 4. ОТПРАВКА ФОРМЫ (ГЛАВНАЯ ЛОГИКА) ===
    loginForm.addEventListener('submit', (e) => {
        // 1. ОСТАНАВЛИВАЕМ СТАНДАРТНУЮ ОТПРАВКУ
        e.preventDefault();
        e.stopPropagation(); // Останавливаем всплытие, чтобы другие скрипты не сработали

        console.log("Нажата кнопка входа. Запуск валидации...");

        let isFormValid = true;
        const formData = {};

        // 2. ПРОВЕРЯЕМ ВСЕ ПОЛЯ ЕЩЕ РАЗ
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                const isFieldValid = validateField(input, field.regex, field.errorId);
                if (!isFieldValid) {
                    isFormValid = false;
                    console.warn(`Ошибка в поле: ${field.id}`);
                } else {
                    const label = input.getAttribute('placeholder') || field.id;
                    formData[label] = input.value;
                }
            }
        });

        // 3. РЕШЕНИЕ: ВХОД ИЛИ ОШИБКА
        if (isFormValid) {
            console.log("Валидация успешна. Показываем окно.");
            showSuccessDialog(formData);
        } else {
            console.error("Валидация провалена. Вход запрещен.");
            // Можно добавить тряску формы или общий алерт, если нужно
            // alert("Исправьте ошибки в форме!"); 
        }
    });

    // === 5. МОДАЛЬНОЕ ОКНО ===
    function showSuccessDialog(data) {
        const oldModal = document.getElementById('resultModal');
        if (oldModal) oldModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'resultModal';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 99999
        });

        let listItems = '';
        for (const [key, value] of Object.entries(data)) {
            listItems += `<li style="margin-bottom: 5px;"><strong>${key}:</strong> ${value}</li>`;
        }

        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            <h2 style="color: #28a745;">Данные приняты!</h2>
            <ul style="text-align: left; background: #cfcfcfff; padding: 15px; border-radius: 5px; list-style: none;">
                ${listItems}
            </ul>
            <button id="finalLoginBtn" style="
                background: #FF7F00; color: white; border: none; padding: 10px 20px;
                font-size: 16px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                Войти в кабинет
            </button>
        `;
        Object.assign(modalContent.style, {
            backgroundColor: 'white', padding: '30px', borderRadius: '10px',
            maxWidth: '400px', width: '90%', textAlign: 'center'
        });

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        document.getElementById('finalLoginBtn').addEventListener('click', () => {
            localStorage.setItem('userFirstName', document.getElementById('firstName').value);
            localStorage.setItem('userLastName', document.getElementById('lastName').value);
            window.location.href = 'profile.html';
        });
    }
});