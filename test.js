(function() {
    'use strict';

    // Функция, которая пытается добавить кнопку
    function tryToAddButton() {
        var headerContent = $('.header__content');
        // Проверяем, существует ли элемент хедера и нет ли уже нашей кнопки
        if (headerContent.length && headerContent.find('[data-action="my_custom_hello_button"]').length === 0) {
            
            var newButton = $('<div class="header__item selector" data-action="my_custom_hello_button">' +
                '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="www.w3.org"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z""")/>><circle cx="15.5" cy="9.5" r="1.5""")/>><circle cx="8.5" cy="9.5" r="1.5""")/>><path d="M12 18c2.28 0 4.22-1.17 5.3-2.93.1-.17.04-.39-.13-.49-.17-.1-.39-.04-.49.13C15.76 16.27 14.01 17 12 17s-3.76-.73-4.68-2.29c-.1-.17-.32-.23-.49-.13-.17.1-.23.32-.13.49C7.78 16.83 9.72 18 12 18z""")/>></svg>' +
                '</div>');

            newButton.on('hover:enter', function() {
                Lampa.Noty.show('Привет! Ты нажал на кнопку.');
            });

            headerContent.append(newButton);
            Lampa.Noty.show('Кнопка "Привет!" успешно добавлена.');
            console.log('Top Menu Button Plugin: Button added.');

            // Дополнительный вызов для обновления навигации, если нужно
            if (typeof Lampa.Navigation.open === 'function') {
               // Lampa.Navigation.open('header'); // Это может быть лишним и вызвать баги, закомментировано по умолчанию
            }
        } else if (!headerContent.length) {
            console.log('Top Menu Button Plugin: Header element not found, trying again soon...');
        }
    }

    // Используем интервал для регулярной проверки и добавления кнопки, пока приложение полностью не прогрузится
    var checkInterval = setInterval(function() {
        if (window.appready) {
            tryToAddButton();
            // Если кнопка добавлена (проверка внутри функции tryToAddButton), интервал можно остановить,
            // но оставим его пока активным на случай перезагрузки интерфейса без полного рестарта приложения
        }
    }, 500); // Проверять каждые полсекунды

    // Останавливаем интервал, если приложение полностью готово и мы уже добавили кнопку
    Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') {
            setTimeout(function() { // Небольшая задержка, чтобы дать всем остальным загрузиться
                tryToAddButton();
            }, 1000); 
        }
    });
})();
