(function () {
    window.plugin_plugins_manager = {
        name: 'Менеджер плагинов',
        version: '1.0.1',
        description: 'Включать/выключать плагины'
    };

    let pluginsList = [];

    function start() {
        // ✅ ИСПРАВЛЕНО: правильное добавление в интерфейс
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'interface') {
                var managerItem = $('<div class="settings-param selector plugin-manager-selector" data-name="plugins_manager">' +
                    '<div class="settings-param__name">🛠️ Менеджер плагинов</div>' +
                    '<div class="settings-param__value">Управление</div>' +
                    '<div class="settings-param__descr">Вкл/выкл плагины</div>' +
                '</div>');

                managerItem.on('hover:enter', function () {
                    showPluginsManager();
                });

                // Добавляем ПОСЛЕ существующего элемента
                e.body.find('[data-name="interface_size"]').after(managerItem);
            }
        });

        // ✅ НОВАЯ ФУНКЦИЯ: показ менеджера
        function showPluginsManager() {
            Lampa.Select.show({
                title: '🛠️ Менеджер плагинов',
                items: [
                    {
                        title: '🔄 Обновить список',
                        onSelect: scanPlugins
                    }
                ],
                onBack: function() {
                    // Возврат в настройки
                }
            });
            
            // Сканируем сразу
            setTimeout(scanPlugins, 100);
        }
    }

    // Сканируем плагины
    function scanPlugins() {
        pluginsList = [];
        
        for (let key in window) {
            if (key.indexOf('plugin_') === 0 && window[key] && window[key].name) {
                let plugin = window[key];
                let enabled = Lampa.Storage.get('plugin_' + key.replace('plugin_', ''), 'true') !== 'false';
                
                pluginsList.push({
                    name: plugin.name || key,
                    key: key,
                    enabled: enabled,
                    version: plugin.version || '1.0',
                    desc: plugin.description || 'Без описания'
                });
            }
        }

        showPluginsList();
    }

    // Показываем список плагинов
    function showPluginsList() {
        var items = [
            { separator: true, title: '📋 Установленные плагины' }
        ];

        pluginsList.forEach(function(plugin) {
            var status = plugin.enabled ? '🟢 Включен' : '🔴 Выключен';
            items.push({
                title: plugin.name + ' v' + plugin.version,
                subtitle: status,
                descr: plugin.desc.substring(0, 50) + '...',
                selected: plugin.enabled,
                onSelect: function() {
                    togglePlugin(plugin.key, !plugin.enabled);
                }
            });
        });

        Lampa.Select.show({
            title: '🔧 Плагины (' + pluginsList.length + ')',
            items: items,
            onBack: function() {
                showPluginsManager();
            }
        });
    }

    // Переключение плагина
    function togglePlugin(pluginKey, enable) {
        var pluginName = window[pluginKey]?.name || pluginKey;
        Lampa.Storage.set('plugin_' + pluginKey.replace('plugin_', ''), enable);
        
        // Уведомление
        Lampa.Noty.show({
            title: enable ? '🟢 Включен' : '🔴 Выключен',
            body: pluginName,
            time: 2000
        });
        
        // Обновляем список
        setTimeout(scanPlugins, 500);
    }

    // Стили
    setTimeout(function() {
        $('<style id="plugin-manager-style">')
            .text(`
                .plugin-manager-selector.selector.focus,
                .plugin-manager-selector.selector.hover {
                    box-shadow: 0 0 0 3px #00ff00 !important;
                    border-radius: 6px !important;
                }
                .plugin-manager-selector.selector.focus .settings-param__name,
                .plugin-manager-selector.hover .settings-param__name {
                    color: #ffffff !important;
                }
            `).appendTo('head');
    }, 100);

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') start();
    });
})();
