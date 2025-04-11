import { Process, Setting } from "@nexus/nexus-module-builder";
import { HexColorSetting, NumberSetting, BooleanSetting, StringSetting, ChoiceSetting } from "@nexus/nexus-module-builder/settings/types";


export const getSettings = (module: Process): (Setting<unknown> | string)[] => {
    return [
        "Display",
        new HexColorSetting(module)
            .setName("Accent Color")
            .setAccessID("accent_color")
            .setDescription("Changes the color of various elements.")
            .setDefault("#2290B5"),

        new NumberSetting(module)
            .setRange(25, 300)
            .setStep(10)
            .setName("Zoom Level (%)")
            .setDefault(100)
            .setAccessID('zoom'),

        new BooleanSetting(module)
            .setName("Open Last Closed Module on Startup")
            .setDefault(false)
            .setAccessID('startup_should_open_last_closed'),

        new StringSetting(module)
            .setName("Startup Module ID")
            .setDefault('built_ins.Home')
            .setAccessID('startup_module_id')
            .setValidator(async (input: any): Promise<string | null> => {
                const installedModules: string[] = (await module.requestExternal("built_ins.Main", "get-module-IDs")).body;
                console.log(installedModules, input.toString(), installedModules.includes(input.toString()))
                if (installedModules.includes(input.toString())) {
                    return input;
                }
                return null;
            }),

        "Developer",
        new BooleanSetting(module)
            .setName('Developer Mode')
            .setAccessID('dev_mode')
            .setDefault(false),

        new BooleanSetting(module)
            .setName("Force Reload Modules at Launch")
            .setDescription("Always recompile modules at launch. Will result in a slower boot.")
            .setAccessID("force_reload")
            .setDefault(false),
    ];
}

export const getInternalSettings = (module: Process): Setting<unknown>[] => {
    return [
        new BooleanSetting(module)
            .setName("Window Maximized")
            .setDefault(false)
            .setAccessID('window_maximized'),

        new NumberSetting(module)
            .setName('Window Width')
            .setDefault(1920)
            .setAccessID("window_width"),

        new NumberSetting(module)
            .setName('Window Height')
            .setDefault(1080)
            .setAccessID('window_height'),

        new NumberSetting(module)
            .setName('Window X')
            .setDefault(50)
            .setAccessID('window_x'),

        new NumberSetting(module)
            .setName('Window Y')
            .setDefault(50)
            .setAccessID('window_y'),

        new StringSetting(module)
            .setName('Module Order')
            .setDefault('')
            .setAccessID('module_order'),

        new StringSetting(module)
            .setName('Last Opened Module')
            .setDefault('built_ins.Home')
            .setAccessID('startup_last_open_id'),
    ];
}