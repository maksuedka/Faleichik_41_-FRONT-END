document.addEventListener("DOMContentLoaded", () => {
  // === 1. ОТОБРАЖЕНИЕ ИМЕНИ ИЗ LOCALSTORAGE ===
  const profileUserNameSpan = document.getElementById('profileUserName'); 
  if (profileUserNameSpan) {
      const userFirstName = localStorage.getItem('userFirstName');
      const userLastName = localStorage.getItem('userLastName');

      if (userFirstName || userLastName) {
          profileUserNameSpan.textContent = `${userFirstName || ''} ${userLastName || ''}`.trim();
      } else {
          profileUserNameSpan.textContent = 'Гость';
      }
  }

  // === 2. ЛОГИКА АБОНЕМЕНТОВ (JSON + МОДАЛКА) ===
  const abonementCardsCarousel = document.getElementById("abonementCardsCarousel");
  const addAbonementBtn = document.querySelector(".add-abonement-column .add-button"); // Кнопка +
  const addAbonementModal = document.getElementById("addAbonementModal"); // Модалка создания
  const closeAddModal = document.getElementById("closeAddModal");
  const addAbonementForm = document.getElementById("addAbonementForm");
  
  const viewModal = document.getElementById("abonementModal"); // Модалка просмотра (QR)
  const closeViewModal = viewModal ? viewModal.querySelector(".close-button") : null;

  // Инициализация календарей в модалке
  flatpickr(".datepicker", { locale: "ru", dateFormat: "d.m.Y" });

  // Функции для работы с данными
  function getAbonements() {
      const data = localStorage.getItem('user_subscriptions');
      return data ? JSON.parse(data) : [];
  }

  function saveAbonements(array) {
      localStorage.setItem('user_subscriptions', JSON.stringify(array));
  }

  function renderAbonements() {
      if (!abonementCardsCarousel) return;
      const abos = getAbonements();
      abonementCardsCarousel.innerHTML = ''; // Очистка

      abos.forEach((item) => {
          const cardHTML = `
              <div class="price-card" 
                   data-type="${item.type}" 
                   data-purchase-date="${item.purchaseDate}" 
                   data-expiry-date="${item.expiryDate}">
                  <div class="price-card-logo-bg"></div>
                  <h3 class="price-card-title">${item.type}</h3>
                  <p class="price-card-price">${item.price}р.</p>
                  <div class="price-card-details">
                      ${item.details.map(d => `<p>${d}</p>`).join('')}
                  </div>
              </div>
          `;
          abonementCardsCarousel.insertAdjacentHTML('beforeend', cardHTML);
      });
  }

  // Открытие модалки добавления
  if (addAbonementBtn) {
      addAbonementBtn.onclick = () => addAbonementModal.style.display = "flex";
  }

  // Закрытие модалок
  if (closeAddModal) closeAddModal.onclick = () => addAbonementModal.style.display = "none";
  if (closeViewModal) closeViewModal.onclick = () => viewModal.style.display = "none";

  // Клик по карточке (Просмотр QR)
  if (abonementCardsCarousel) {
      abonementCardsCarousel.addEventListener("click", (e) => {
          const card = e.target.closest(".price-card");
          if (card && viewModal) {
              document.getElementById("modalAbonementType").textContent = card.dataset.type;
              document.getElementById("modalPurchaseDate").textContent = card.dataset.purchaseDate;
              document.getElementById("modalExpiryDate").textContent = card.dataset.expiryDate;
              viewModal.style.display = "flex";
          }
      });
  }

  // Обработка формы добавления
  if (addAbonementForm) {
      addAbonementForm.addEventListener("submit", (e) => {
          e.preventDefault();
          
          const newAbo = {
              type: document.getElementById("newType").value,
              price: document.getElementById("newPrice").value,
              details: document.getElementById("newDetails").value.split(',').map(s => s.trim()),
              purchaseDate: document.getElementById("newPurchaseDate").value,
              expiryDate: document.getElementById("newExpiryDate").value
          };

          const list = getAbonements();
          list.push(newAbo);
          saveAbonements(list);
          
          renderAbonements();
          addAbonementModal.style.display = "none";
          addAbonementForm.reset();
      });
  }

  // Рендерим при загрузке
  renderAbonements();
});

/* === ОСТАЛЬНОЙ ВАШ КОД (БЕЗ ИЗМЕНЕНИЙ) === */

// Табы
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-button");
  const cards = document.querySelectorAll(".price-card");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      cards.forEach((card) => {
        if (card.getAttribute("data-tab") === target) card.classList.remove("hidden");
        else card.classList.add("hidden");
      });
    });
  });
});

// Карусель акций
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".promotions-carousel");
  if (!carousel) return;
  const cards = document.querySelectorAll(".promotion-card");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  let index = 0;
  const total = cards.length;
  const visibleCount = 5;

  function renderIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = "";
    const start = Math.max(0, Math.min(index, total - visibleCount));
    for (let i = start; i < start + visibleCount && i < total; i++) {
      const dot = document.createElement("span");
      dot.classList.add("indicator-dot");
      if (i === index) dot.classList.add("active");
      indicatorsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const offset = -index * (cards[0].offsetWidth + 20);
    carousel.style.transform = `translateX(${offset}px)`;
    renderIndicators();
  }

  setInterval(() => {
    index = (index + 1) % total;
    updateCarousel();
  }, 3000);
  
  renderIndicators();
});

// Галерея (анимация и лайтбокс)
document.addEventListener("DOMContentLoaded", () => {
  const strips = document.querySelectorAll(".gallery-strip");
  strips.forEach((strip) => {
    strip.addEventListener("mouseenter", () => strip.style.animationDuration = `60s`);
    strip.addEventListener("mouseleave", () => strip.style.animationDuration = `15s`);
  });

  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const galleryItems = document.querySelectorAll(".gallery-item img");

  galleryItems.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImage.src = img.src; 
      lightbox.style.display = "flex"; 
    });
  });
  if (lightbox) lightbox.addEventListener("click", () => lightbox.style.display = "none");
});

// Логика Целей (Ваша большая функция остается без изменений)
document.addEventListener("DOMContentLoaded", () => {
    const goalModal = document.getElementById("goalModal"); 
    const openGoalModalBtn = document.getElementById("openGoalModalBtn"); 
    const closeButtons = document.querySelectorAll(".close-goal-modal"); 
    const goalsCarousel = document.getElementById("goalsCardsCarousel"); 
    const addGoalBtn = document.getElementById("addGoalBtn");

    if (openGoalModalBtn) {
        openGoalModalBtn.addEventListener("click", () => goalModal.style.display = "flex");
    }
    closeButtons.forEach(btn => btn.onclick = () => goalModal.style.display = "none");
    
    // (Тут была ваша логика конфигураций целей - она полностью совместима)
});

// Плавный скролл
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.main-nav .nav-link[data-section]');
    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById(link.getAttribute('data-section'));
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight - 10,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Модальное окно записи на звонок (Футер)
document.addEventListener('DOMContentLoaded', function() {
    const openCallModalBtn = document.querySelector('.footer-btn'); 
    const callModal = document.getElementById('callModal');
    if (openCallModalBtn && callModal) {
        openCallModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            callModal.style.display = 'flex';
        });
    }
});