# Nexus: Process
## Overview
The process is the backend of your module. It has no access to the DOM, and sends/receives data from the renderer process. Inside the parent `Process` class are many functions that can be utilized to control the state of the module at various times.



## Main Functions

### `constructor`
While the `constructor` is the entry point to your module, it takes time for the renderer to be initialized. Therefore, your `constructor` should NOT have logic that is pertinent to your GUI. Instead, use the [`initialize`](#initialize-void) function.

```typescript
export default class SampleProcess extends Process {
    public constructor() {
        super(MODULE_ID, MODULE_NAME, HTML_PATH, ICON_PATH);
    }
}
```
The `super()` constructor takes 4 parameters.
> **Parameters**  
> `moduleID: string` → the ID of your module.  
> `moduleName: string` → the display name of your module.  
> `htmlPath: string` → A relative path to the renderers `index.html`. If this is `undefined`, your module will be treated as an internal module.  
> `iconPath: string?` → A relative path to the icon of your module. The icon can be an `svg`, `jpg`, `png`, or `jpeg` and will be displayed as a 36px by 36px icon. If this is `undefined`, your icon will be the an acronym of your module (max three characters).



---

### `initialize(): void`
You must do a call to `super.initialize()`

By default, this is called when the renderer is initialized and is now listening to events sent from the process.



---

### `registerSettings(): (Setting<unknown> | string)[]`
This function is registers any settings your module may use.

> **Returns**:  
> An array of both `Settings` or strings.

The array type is both Settings and strings to allow for section headers. Section headers and settings are added in the order they are listed in the array.

**Note**: Any settings listed here will be listed in the settings module. If you have an internal setting, see the internal settings function.

Example usage:
``` typescript
public registerSettings(): (Setting<unknown> | string)[] {
  return [
    "Sample Setting Group",
    new BooleanSetting(this)
      .setDefault(false)
      .setName("Sample Toggle Setting")
      .setDescription("An example of a boolean setting!")
      .setAccessID('sample_bool')
  ];
}
```
This code will result in an UI of:  
![Sample Setting UI](../assets/sample-setting.png)



---

### `registerInternalSettings(): Setting<unknown>[]`
Similar to the `registerSettings` function, this also registers settings to a module BUT does not display them in the Settings module. This is useful for settings that should not be directly modified by the user, and can only be modified programmatically.

Internal settings are accessible the same way normal settings are.

> **Returns**:  
>   An array of internal settings

Example: `built_ins.Settings`
```typescript
public registerInternalSettings(): Setting<unknown>[] {
  return [
    new BooleanSetting(this)
      .setName("Window Maximized")
      .setDefault(false)
      .setAccessID('window_maximized'),

    new NumberSetting(this)
      .setName('Window Width')
      .setDefault(1920)
      .setAccessID("window_width"),
	...
   ];
}
```
The `Settings` module keeps track of the bounds and the maximized state of the window on exit and restores it when the application is re-opened. However, these preferences do not need to be displayed to the user, and theese are considered an internal setting.

### `refreshSettings(modifiedSetting: Setting<unknown>): void`
This function triggers when a setting that belongs to this module is modified.

> **Parameters**:  
`modifiedSetting: Setting<unknown>` → The `Setting` that was modified.



---

### `handleEvent(eventType: string, data: any[]) Promise<any>`
This function is called whenever the renderer sends an event. Use a `switch-case` or `if` statements to distinguish the event type and handle them appropriately. If the renderer does NOT expect a response, the function does not need to send one back. If the renderer DOES expect a response, this function can return a Promise that resolves to the data type.


>**Parameters**:  
`eventType: string` → The name of the event.  
`data: any[]` → Any data associated with the event. If the renderer sends no data, this will be an empty array.

>**Returns**  
`Promise<any>` → If the renderer expects a response, the return value can be a Promise that resolves with the response value. 



---

### `sendToRenderer(eventType: string, ...data: any[]): void`
This function is used to send events from the process to the renderer. 

If your module is an internal module (undefined HTML path), this will do nothing.
 
> **Parameters:**  
`eventType: string` → The name of the event.  
`data: any[]` → Any data associated with the event. If the renderer sends no data, this will be an empty array.



---

### `onGUIShown(): void`
This function is called whenever the module is displayed. 



---

### `onGUIHidden(): void`
This function is called whenever the module is hidden.



---

### `onExit(): void`
This function is called before the application closes.



---

### `refreshAllSettings(): void`
This function passes each setting into the `refreshSettings` function as if they were modified. This function is only used in the module initialization process and should be used carefully.



---

### `isInitialized(): boolean`
> **Returns**  
> True if the module has been initialized, false otherwise.



## Information Getters/Setters
### `getName(): string`
> **Returns**  
> The name of the module.



---

### `getID(): string`
> **Returns**  
> The ID of the module.



---

### `getIPCSource(): string`
In most cases, this is synonymous to [`getID`](#getid-string).
> **Returns**  
> The ID of the module.



---

### `getHTMLPath(): string | undefined`
> **Returns**  
> The relative path to the associated `index.html` in the renderer. If this is `undefined`, the module is an internal module.



---

### `getIconPath(): string | undefined`
> **Returns**  
> The relative path to the icon. If this is `undefined`, there is no icon set.



---

### `getSettings(): ModuleSettings`
> **Returns**  
> A [`ModuleSettings`](./ModuleSettings.md) class that manages the settings associated with your module.




---


### `getModuleInfo(): ModuleInfo`
> **Returns**
> A ModuleInfo object that contains metadata about your module.





---

## Internal Functions (do not use)
### `setModuleInfo(moduleInfo: ModuleInfo): void`
This function is called internally to set the metadata of your module as specified in `module-info.json`. This function should be ignored and will always throw an `Error` object.

---

### `setIPC(): void`
This function is called internally to pass the required functions to interface with other modules and communicate with the renderer. This function should be ignored and will always throw an `Error`.