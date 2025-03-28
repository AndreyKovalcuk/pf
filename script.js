// Словарь с переводами
const translations = {
    ru: {
        'about': 'Обо мне',
        'projects': 'Проекты',
        'contact': 'Контакты',
        'portfolio-title': 'Мое Портфолио',
        'portfolio-subtitle': 'Веб-разработчик | Программист',
        'projects-note': '* Список проектов будет пополняться новыми работами',
        'about-text': 'Привет! Я веб-разработчик с опытом работы в C#. Создаю современные веб-приложения и десктопные программы, используя передовые технологии и лучшие практики разработки.',
        'skills-title': 'Мои навыки:',
        'calculator': 'Калькулятор на C#',
        'calculator-description': 'Многофункциональный калькулятор с современным интерфейсом, разработанный на C# с использованием Windows Forms.',
        'converter': 'Конвертер валют',
        'converter-description': 'Приложение для конвертации валют с актуальными курсами, разработанное на C# с использованием API для получения курсов валют.',
        'contact-title': 'Связаться со мной',
        'name-label': 'Ваше имя:',
        'message-label': 'Сообщение:',
        'send-button': 'Отправить',
        'code': 'Код',
        'demo': 'Демо',
        // Новые переводы для демо-страниц
        'back': 'Назад',
        'converter-title': 'Конвертер валют - Демонстрация',
        'calculator-title': 'Калькулятор - Демонстрация',
        'features-title': 'Особенности приложения:',
        'requirements-title': 'Системные требования:',
        'feature-1': 'Актуальные курсы валют через API',
        'feature-2': 'Поддержка основных мировых валют',
        'feature-3': 'Мгновенный пересчет при изменении суммы',
        'feature-4': 'Удобный и понятный интерфейс',
        'feature-5': 'Поддержка дробных чисел',
        'feature-6': 'Автоматическое обновление курсов',
        'req-1': 'Windows 7/8/10/11',
        'req-2': '.NET Framework 4.7.2 или выше',
        'req-3': 'Подключение к интернету',
        'req-4': 'Минимум 2GB RAM',
        'req-5': '50MB свободного места на диске',
        'download-btn': 'Скачать',
        // Переводы для калькулятора
        'calc-feature-1': 'Современный пользовательский интерфейс',
        'calc-feature-2': 'Основные математические операции',
        'calc-feature-3': 'Работа с десятичными числами',
        'calc-feature-4': 'История вычислений',
        'calc-feature-5': 'Поддержка клавиатурного ввода',
        'calc-feature-6': 'Копирование результата в буфер обмена',
        'github': 'GitHub'
    },
    en: {
        'about': 'About',
        'projects': 'Projects',
        'contact': 'Contact',
        'portfolio-title': 'My Portfolio',
        'portfolio-subtitle': 'Web Developer | Programmer',
        'projects-note': '* Project list will be updated with new works',
        'about-text': 'Hi! I\'m a web developer with experience in C#. I create modern web applications and desktop programs using cutting-edge technologies and best development practices.',
        'skills-title': 'My Skills:',
        'calculator': 'C# Calculator',
        'calculator-description': 'A multifunctional calculator with a modern interface, developed in C# using Windows Forms.',
        'converter': 'Currency Converter',
        'converter-description': 'A currency conversion application with real-time rates, developed in C# using API for getting exchange rates.',
        'contact-title': 'Contact Me',
        'name-label': 'Your Name:',
        'message-label': 'Message:',
        'send-button': 'Send',
        'code': 'Code',
        'demo': 'Demo',
        // Новые переводы для демо-страниц
        'back': 'Back',
        'converter-title': 'Currency Converter - Demo',
        'calculator-title': 'Calculator - Demo',
        'features-title': 'Application Features:',
        'requirements-title': 'System Requirements:',
        'feature-1': 'Real-time exchange rates via API',
        'feature-2': 'Support for major world currencies',
        'feature-3': 'Instant recalculation when amount changes',
        'feature-4': 'User-friendly interface',
        'feature-5': 'Decimal number support',
        'feature-6': 'Automatic rate updates',
        'req-1': 'Windows 7/8/10/11',
        'req-2': '.NET Framework 4.7.2 or higher',
        'req-3': 'Internet connection',
        'req-4': 'Minimum 2GB RAM',
        'req-5': '50MB free disk space',
        'download-btn': 'Download',
        // Переводы для калькулятора
        'calc-feature-1': 'Modern user interface',
        'calc-feature-2': 'Basic mathematical operations',
        'calc-feature-3': 'Decimal number support',
        'calc-feature-4': 'Calculation history',
        'calc-feature-5': 'Keyboard input support',
        'calc-feature-6': 'Copy result to clipboard',
        'github': 'GitHub'
    }
};

// Функция для переключения языка
function switchLanguage(lang) {
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // Обновляем классы кнопок
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Обновляем все элементы с переводами
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.dataset.key || element.textContent.trim();
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Инициализация переключателя языков
document.addEventListener('DOMContentLoaded', () => {
    // Получаем сохраненный язык или используем русский по умолчанию
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
    
    // Устанавливаем начальный язык
    switchLanguage(savedLanguage);
    
    // Добавляем обработчики для кнопок переключения языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Обработка отправки формы
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Блокируем кнопку на время отправки
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        fetch(form.action, {
                method: 'POST',
            body: new FormData(form),
                headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showNotification('Спасибо! Ваше сообщение отправлено.', 'success');
                form.reset();
            } else {
                throw new Error('Ошибка при отправке сообщения');
            }
        })
        .catch(error => {
            showNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить';
        });
    });
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Учитываем высоту фиксированной навигации
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Добавляем задержку для дочерних элементов
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми секциями
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Создаем иконку
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        // Создаем текст
        const text = document.createElement('span');
        text.textContent = message;
        
        // Создаем кнопку закрытия
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'notification-close';
        
        // Собираем уведомление
        notification.appendChild(icon);
        notification.appendChild(text);
        notification.appendChild(closeBtn);
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Обработчик закрытия
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Добавляем стили для уведомлений
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(30, 41, 59, 0.95);
            color: white;
            padding: 1.2rem 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 1000;
            border: 1px solid rgba(139, 92, 246, 0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 300px;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification i {
            color: #8b5cf6;
            font-size: 1.5rem;
        }
        
        .notification span {
            flex: 1;
            font-size: 1.1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
        }
    `;
    document.head.appendChild(style);
}); 