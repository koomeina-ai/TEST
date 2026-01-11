(function () {
    window.plugin_plugins_manager = {
        name: 'Менеджер плагинов',
        version: '1.0.0',
        description: 'Включать/выключать плагины из меню'
    };

    let pluginsList = [];

    function start() {
        // Добавляем в настройки раздел "Плагины"
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'plugins_manager') {
                createPluginsPanel(e);
            }
            else if (e.name == 'interface') {
                // Добавляем кнопку в основной интерфейс
                var managerItem = $('<div class="settings-param selector plugin-manager-selector">' +
                    '<div class="settings-param__name">🛠️ Менеджер плагинов</div>' +
                    '<div class="settings-param__value">Управление плагинами</div>' +
                    '<div class="settings-param__descr">Вкл/выкл плагины</div>' +
                '</div>');

                managerItem.on('hover:enter', function () {
                    Lampa.Settings.open('plugins_manager');
                });

                e.body.append(managerItem);
            }
        });

        // Создаем панель управления плагинами
        function createPluginsPanel(e) {
            e.body.empty();
            
            // Заголовок
            var title = $('<div class="settings-panel__title-text">Менеджер плагинов</div>');
            e.body.append(title);

            // Кнопка обновить список
            var refreshBtn = $('<div class="settings-param selector plugin-manager-selector">' +
                '<div class="settings-param__name">🔄 Обновить список</div>' +
            '</div>');
            refreshBtn.on('hover:enter', scanPlugins);
            e.body.append(refreshBtn);

            // Список плагинов
            var list = $('<div class="plugins-list"></div>');
            e.body.append(list);

            scanPlugins();
        }

        // Сканируем все плагины
        function scanPlugins() {
            pluginsList = [];
            
            // Ищем все плагины в window
            for (let key in window) {
                if (key.indexOf('plugin_') === 0 && window[key] && window[key].name) {
                    let plugin = window[key];
                    let enabled = Lampa.Storage.get('plugin_' + key, 'true') !== 'false';
                    
                    pluginsList.push({
                        name: plugin.name || key,
                        key: key,
                        enabled: enabled,
                        version: plugin.version || '1.0',
                        desc: plugin.description || 'Без описания'
                    });
                }
            }

            renderPluginsList();
        }

        // Отрисовываем список
        function renderPluginsList() {
            var list = $('.plugins-list');
            list.empty();

            pluginsList.forEach(function(plugin, index) {
                var status = plugin.enabled ? '🟢 Включен' : '🔴 Выключен';
                var item = $('<div class="settings-param selector plugin-manager-selector">' +
                    '<div class="settings-param__name">' + plugin.name + ' v' + plugin.version + '</div>' +
                    '<div class="settings-param__value">' + status + '</div>' +
                    '<div class="settings-param__descr">' + plugin.desc + '</div>' +
                '</div>');

                item.on('hover:enter', function() {
                    togglePlugin(plugin.key, !plugin.enabled);
                });

                list.append(item);
            });
        }

        // Включить/выключить плагин
        function togglePlugin(pluginKey, enable) {
            Lampa.Storage.set('plugin_' + pluginKey, enable);
            
            // Перезагружаем плагин если нужно
            if (window[pluginKey] && window[pluginKey].toggle) {
                window[pluginKey].toggle(enable);
            }

            // Обновляем список
            scanPlugins();

            // Показываем уведомление
            var html = $('<div class="simple-notify">' +
                '<div class="simple-notify__title">' + (enable ? 'Включен' : 'Выключен') + '</div>' +
                '<div class="simple-notify__text">' + window[pluginKey]?.name + '</div>' +
            '</div>');
            
            Lampa.Noty.show(html, {
                time: 3000,
                backdrop: true
            });
        }

        // Зеленое выделение
        var style = $('<style id="plugin-manager-style"></style>').appendTo('head');
        style.text(`
            .plugin-manager-selector.focus, .plugin-manager-selector.hover {
                box-shadow: 0 0 0 3px #00ff00 !important;
                border-radius: 6px !important;
            }
            .plugin-manager-selector.focus .settings-param__name,
            .plugin-manager-selector.hover .settings-param__name {
                color: #ffffff !important;
            }
        `);

        // Добавляем в главное меню настроек
        Lampa.Settings.main({
            name: 'plugins_manager',
            title: '🛠️ Плагины',
            items: [{
                title: 'Управление плагинами',
                html: 'Включать/выключать плагины',
                onHover: function() {
                    Lampa.Settings.open('plugins_manager');
                }
            }]
        });
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
