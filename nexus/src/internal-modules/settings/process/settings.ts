import { Process, Setting } from "@nexus-app/nexus-module-builder";
import { HexColorSetting, NumberSetting, BooleanSetting, StringSetting, ChoiceSetting, FileUploadSetting } from "@nexus-app/nexus-module-builder/settings/types";
import { BaseWindow, nativeTheme, Rectangle, WebContentsView } from "electron";
import { readInternal, parseInternalArgs, writeInternal } from "../../../init/internal-args";
import { MAIN_ID } from "../../../main";

export const devModeSubscribers: ((isDev: boolean) => void)[] = [];

export const onSettingModified = async (module: Process, modifiedSetting?: Setting<unknown>): Promise<void> => {
    if (modifiedSetting === undefined) {
        return;
    }
    switch (modifiedSetting.getAccessID()) {
        case 'collapse_sidebar': {
            const window: BaseWindow = (await module.requestExternal(MAIN_ID, 'get-primary-window')).body;
            const view: WebContentsView & { collapsed: boolean } = window.contentView.children.at(-1) as any;

            view.collapsed = modifiedSetting.getValue() as boolean;
            window.contentView.children.forEach((view: WebContentsView) => view.emit("bounds-changed"));

            break;
        }

        case "zoom": {
            const zoom: number = modifiedSetting.getValue() as number;
            const window: BaseWindow = (await module.requestExternal(MAIN_ID, 'get-primary-window')).body;

            window.contentView.children.forEach(
                (view: WebContentsView) => {
                    view.webContents.setZoomFactor(zoom / 100);
                    view.emit("bounds-changed");
                });
            break;
        }
        case "accent_color": {
            const window: BaseWindow = (await module.requestExternal(MAIN_ID, 'get-primary-window')).body;

            window.contentView.children.forEach(
                (view: WebContentsView) => {
                    view.webContents.executeJavaScript(`document.documentElement.style.setProperty('--accent-color', '${modifiedSetting.getValue()}')`)
                });
            break;
        }
        case "dev_mode": {
            module.sendToRenderer("is-dev", modifiedSetting.getValue());
            devModeSubscribers.forEach((callback) => {
                callback(modifiedSetting.getValue() as boolean);
            })
            break;
        }

        case "force_reload": {
            const shouldForceReload: boolean = modifiedSetting.getValue() as boolean;

            readInternal().then(parseInternalArgs).then(args => {
                if (shouldForceReload) {
                    if (!args.includes("--force-reload")) {
                        args.push("--force-reload");
                    }
                } else {
                    args = args.filter(arg => arg !== "--force-reload");
                }

                return writeInternal(args);
            });
            break;

        }
        case "dark_mode": {
            // System, Dark, Light
            const mode: string = modifiedSetting.getValue() as string;
            nativeTheme.themeSource = mode.toLowerCase() as any;
            break;
        }
    }
}


export const getSettings = (module: Process): (Setting<unknown> | string)[] => {
    return [
        "Appearance",
        new ChoiceSetting(module)
            .addOptions("Dark", "Light", "System")
            .setName("Theme")
            .setDefault("Dark")
            .setAccessID('dark_mode'),

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
            .setName('Collapse Sidebar')
            .setDefault(false)
            .setAccessID('collapse_sidebar'),

        "Startup",
        new BooleanSetting(module)
            .setName("Open Last Closed Module on Startup")
            .setDefault(false)
            .setAccessID('startup_should_open_last_closed'),

        new StringSetting(module)
            .setName("Startup Module ID")
            .setDefault('nexus.Home')
            .setAccessID('startup_module_id')
            .setValidator(async (input: any) => {
                const installedModules: string[] = (await module.requestExternal(MAIN_ID, "get-module-IDs")).body;

                if (installedModules.includes(input)) {
                    return input;
                }
                return null;
            }),

        "Developer",
        new BooleanSetting(module)
            .setName("Automatically Check for Nexus Updates")
            .setDescription("Check for updates automatically.")
            .setAccessID("always_update")
            .setDefault(true),

        new BooleanSetting(module)
            .setName("Automatically Check for Module Updates")
            .setDescription("Limited to 60 an hour.")
            .setAccessID("check_module_updates")
            .setDefault(false),

        new BooleanSetting(module)
            .setName("Force Reload Modules at Launch")
            .setDescription("Always recompile modules at launch. Will result in a slower boot.")
            .setAccessID("force_reload")
            .setDefault(false),

        new BooleanSetting(module)
            .setName('Developer Mode')
            .setAccessID('dev_mode')
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
            .setDefault('nexus.Home')
            .setAccessID('startup_last_open_id'),
    ];
}