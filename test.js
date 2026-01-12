// ===== РЕГИСТРАЦИЯ ПЛАГИНА =====

Lampa.Plugins.add({
    name: 'LAMPA Backup',
    author: 'ChatGPT',
    version: '2.0',
    description: 'Бэкап и восстановление настроек',
    icon: 'backup',

    onInstall: function () {
        console.log('LAMPA Backup installed');
    },

    onStart: function () {
        Lampa.Listener.follow('menu', function (event) {
            if (event.name === 'plugins') {
                event.items.push({
                    title: 'LAMPA Backup',
                    description: 'Импорт / экспорт настроек и плагинов',
                    onClick: function () {
                        Plugin.open();
                    }
                });
            }
        });
    }
});
