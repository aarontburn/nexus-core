"use strict";
exports.__esModule = true;
exports.getInternalSettings = exports.getSettings = void 0;
var types_1 = require("@nexus/nexus-module-builder/settings/types");
var getSettings = function (module) {
    return [
        "Display",
        new types_1.BooleanSetting(module)
            .setName("Dark Mode")
            .setDefault(true)
            .setAccessID('dark_mode'),
        new types_1.HexColorSetting(module)
            .setName("Accent Color")
            .setAccessID("accent_color")
            .setDescription("Changes the color of various elements.")
            .setDefault("#2290B5"),
        new types_1.NumberSetting(module)
            .setRange(25, 300)
            .setStep(10)
            .setName("Zoom Level (%)")
            .setDefault(100)
            .setAccessID('zoom'),
        new types_1.BooleanSetting(module)
            .setName("Open Last Closed Module on Startup")
            .setDefault(false)
            .setAccessID('startup_should_open_last_closed'),
        new types_1.StringSetting(module)
            .setName("Startup Module ID")
            .setDefault('built_ins.Home')
            .setAccessID('startup_module_id'),
        "Developer",
        new types_1.BooleanSetting(module)
            .setName('Developer Mode')
            .setAccessID('dev_mode')
            .setDefault(false),
        new types_1.BooleanSetting(module)
            .setName("Force Reload Modules at Launch")
            .setDescription("Always recompile modules at launch. Will result in a slower boot.")
            .setAccessID("force_reload")
            .setDefault(false),
    ];
};
exports.getSettings = getSettings;
var getInternalSettings = function (module) {
    return [
        new types_1.BooleanSetting(module)
            .setName("Window Maximized")
            .setDefault(false)
            .setAccessID('window_maximized'),
        new types_1.NumberSetting(module)
            .setName('Window Width')
            .setDefault(1920)
            .setAccessID("window_width"),
        new types_1.NumberSetting(module)
            .setName('Window Height')
            .setDefault(1080)
            .setAccessID('window_height'),
        new types_1.NumberSetting(module)
            .setName('Window X')
            .setDefault(50)
            .setAccessID('window_x'),
        new types_1.NumberSetting(module)
            .setName('Window Y')
            .setDefault(50)
            .setAccessID('window_y'),
        new types_1.StringSetting(module)
            .setName('Module Order')
            .setDefault('')
            .setAccessID('module_order'),
        new types_1.StringSetting(module)
            .setName('Last Opened Module')
            .setDefault('built_ins.Home')
            .setAccessID('startup_last_open_id'),
    ];
};
exports.getInternalSettings = getInternalSettings;
//# sourceMappingURL=settings.js.map