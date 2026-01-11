(function() {
    'use strict';

    function startTestPlugin() {
        console.log('✅ Lampa Test Plugin: Loaded successfully in console!');
        
        // Показывает зеленое всплывающее уведомление на экране
        Lampa.Noty.show('Проверочный плагин загружен!', {
            life: 5000, // Уведомление висит 5 секунд
            type: 'default' // Тип уведомления
        });

        // Добавляем маленький индикатор в меню, чтобы было видно, что плагин активен
        var menu = $('body').find('.menu__list');
        menu.append('<li class="menu__item"><div class="menu__text" style="color: green;">[TEST OK]</div></li>');
    }

    // Ждем полной загрузки приложения Lampa перед запуском нашего кода
    if (window.appready) startTestPlugin();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') startTestPlugin();
    });
})();
