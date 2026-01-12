(function () {
    'use strict';

    if (!window.Lampa) return;

    const PLUGIN_URL = document.currentScript.src;

    function openMenu() {
        Lampa.Select.show({
            title: 'TEST Backup Plugin',
            items: [
                {
                    title: 'Проверка',
                    onClick: function () {
                        Lampa.Noty.show('Плагин работает ✔');
                    }
                }
            ]
        });
    }

    Lampa.Plugins.add({
        name: 'TEST Backup Plugin',
        author: 'User',
        version: '1.0.0',
        description: 'Корректный плагин для LAMPA',
        url: PLUGIN_URL,

        onStart: function () {
            Lampa.Listener.follow('menu', function (event) {
                if (event.name !== 'plugins') return;

                event.items.push({
                    title: 'TEST Backup Plugin',
                    description: 'Без крашей',
                    onClick: openMenu
                });
            });
        }
    });

})();
