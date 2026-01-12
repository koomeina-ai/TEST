(function () {
    'use strict';

    if (!window.Lampa) {
        console.log('LAMPA not found');
        return;
    }

    function openMenu() {
        Lampa.Select.show({
            title: 'TEST Backup Plugin',
            items: [
                {
                    title: 'Проверка',
                    description: 'Если ты это видишь — всё работает',
                    onClick: function () {
                        Lampa.Noty.show('Плагин работает ✔');
                    }
                }
            ]
        });
    }

    Lampa.Listener.follow('menu', function (event) {
        if (event.name !== 'plugins') return;

        event.items.push({
            title: 'TEST Backup Plugin',
            description: 'Тест без Settings.add',
            onClick: openMenu
        });
    });

})();
