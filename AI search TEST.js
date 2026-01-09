(function() {
    'use strict';
    Lampa.Plugins.SimpleTest = {
        init: function() {
            console.log('✅ Simple Test Plugin Loaded!');
            Lampa.Noty.show('Тестовый плагин успешно загружен!');
        }
    };
    if (window.appready) Lampa.Plugins.SimpleTest.init();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') Lampa.Plugins.SimpleTest.init();
    });
})();
