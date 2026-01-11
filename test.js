(function () {
    window.plugin_font_size = {
        name: 'Размер шрифта Stable',
        version: '1.3.0',
        description: 'Изменение размера текста от 8 до 36px без ошибок меню'
    };

    function start() {
        // Оборачиваем код в try...catch для отлова возможных ошибок
        try {
            Lampa.Settings.listener.follow('open', function (e) {
                if (e.name == 'interface') {
                    var current = Lampa.Storage.get('font_size_value', '16');
                    var item = $('<div class="settings-param selector" data-name="font_size_value">' +
                        '<div class="settings-param__name">Размер шрифта</div>' +
                        '<div class="settings-param__value">' + current + 'px</div>' +
                        '<div class="settings-param__descr">Выберите размер текста (от 8 до 36px)</div>' +
                    '</div>');

                    item.on('hover:enter', function () {
                        var items = [];
                        for (var i = 8; i <= 36; i++) {
                            items.push({
                                title: i + 'px',
                                value: i,
                                selected: i == current
                            });
                        }

                        Lampa.Select.show({
                            title: 'Размер шрифта',
                            items: items,
                            onSelect: function (a) {
                                Lampa.Storage.set('font_size_value', a.value);
                                applySize(a.value);
                                item.find('.settings-param__value').text(a.value + 'px');
                                Lampa.Controller.back(); // Закрываем меню выбора
                            },
                            onBack: function(){
                                Lampa.Controller.back(); // Возврат по кнопке "назад"
                            }
                        });
                    });

                    e.body.find('[data-name="interface_size"]').after(item);
                }
            });
        } catch (e) {
            console.error('Plugin Font Size error:', e);
            // Дополнительно можно показать ошибку в интерфейсе Lampa
            Lampa.Noty.show('Ошибка плагина "Размер шрифта": ' + e.message);
        }


        function applySize(size) {
            var val = size || Lampa.Storage.get('font_size_value', '16');
            var style = $('#plugin-font-size-style');
            if (!style.length) {
                style = $('<style id="plugin-font-size-style"></style>').appendTo('head');
            }
            style.text('html, body { font-size: ' + val + 'px !important; }');
        }

        applySize();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
