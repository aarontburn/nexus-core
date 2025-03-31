### Modules: The Process
Author: [@aarontburn](https://github.com/aarontburn)  
Guide for [Modules](https://github.com/aarontburn/modules)


# The Process
The process is the "true backend" of your module. It has no access to the DOM, and can only send/receive data from the renderer process. Inside the parent `Process` class are many functions that can be utilized to control the state of the module at various times.

Many fields in the parent `Process` object are public. This is an unfortunate side-effect of the module-loading process. Functions and fields that start with an underscore (e.g. `_moduleName`) should not be directly referenced.


## Main Functions

### `constructor`
This should NOT be called anywhere. This is only to setup the class before the renderer is ready. Anything important done in the constructor might not be reflected in the renderer.

### `initialize(): void`
You must do a call to `super.initialize()`

This is the entry point of your module. This function is called when the renderer sends the `init` signal to tell the process that it is ready. 

### `registerSettings(): (Setting\<unknown> | string)[]`
This function is used to intialize any settings your module may use.

**Returns:**
> An array of either Settings or strings.

The array type is both Settings and strings to allow for section headers. Section headers and settings are added in the order they are listed in the array.

Note: Any settings listed here will be listed in the settings module. If you have an internal setting, see the internal settings function.

Example usage:
```
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
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/5bf02427-68fe-459f-bd30-563dfb0b2f72)

### `registerInternalSettings(): Setting\<unknown>[]`
Similar to the `registerSettings` function, this also registers settings to a module BUT does not display them in the Settings module. This is useful for settings that should not be directly modified by the user, and can only be modified programmatically.

Internal settings are accessible the same way normal settings are.


**Returns**
> An array of internal settings

Example: `built_ins.Settings`
```
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
The `Settings` module keeps track of the bounds and the maximized state of the window on exit and restores it when the application is re-opened. However, these preferences do not need to be displayed to the user, and this are considered an internal setting.

### `refreshSettings(modifiedSetting: Setting<unknown>): void`
This function triggers when a setting that belongs to this module is modified.

**Parameters**:  
> **modifiedSetting**: Setting\<unknown> → The modified Setting.


### `async` `handleEvent(eventType: string, ...data: any[]) Promise<any>`
This function is called whenever the renderer sends an event. Use a `switch-case` or `if` statements to distinguish the event type and handle them appropriately. If the renderer does NOT expect a response, the function does not need to send one back. If the renderer DOES expect a response, this function can return a Promise that resolves to the data type.


**Parameters:**
> **eventType**: _string_ → The name of the event.  
> **data**: _any[]_ → Any data associated with the event. If the renderer sends no data, this will be an empty array.

**Returns**
> **Promise\<any>** → If the renderer expects a response, the return value can be a Promise that resolves with the response value. 


### `sendToRenderer(eventType: string, ...data: any[]): void`
This function can be used to send events from the process to the renderer. 

**Parameters:**
> **eventType**: string → The name of the event.  
> **data**: any[] → Any data associated with the event. If the renderer sends no data, this will be an empty array.

### `onGUIShown(): void`
This function is called whenever the module is displayed. 

### `onGUIHidden(): void`
This function is called whenever the module is hidden.


### `onExit(): void`
This function is called before the application closes.


## Inter-Module Communication (IMC)
Modules are equipped with tools to communicate with each other. However, the communication is not direct, as there is no guarantee that the target module is installed. Module dependencies is a feature planned for the future.

In order to handle responses from external modules, a module can expose an API. 

### `async` `handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<any>`
Exposes an API to other modules. Use a `switch-case` or `if` statements to handle the event type. If a module leaves this function as its default implementation, it will always return `null`.

**Parameters:**
> **source**: IPCSource → The module that is sending an event. The ID of the module can be found through `source.getIPCSource()`.   
> **eventType**: string → The name of the event.   
> **data**: any[] →  Any data associated with the event. If the source module sends no data, this will be an empty array. 

**Returns:**
> A Promise\<any> that resolves to the return type of the call, if applicable.


Example: `built_ins.Settings`'s implementation 
```
public async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<any> {
  switch (eventType) {
    case 'isDeveloperMode': {
      return this.getSettings().getSetting('dev_mode').getValue() as boolean;
    }
    case 'onDevModeChanged': {
      const callback: (isDev: boolean) => void = data[0];
      this.devModeSubscribers.push(callback);
      callback(this.getSettings().getSetting('dev_mode').getValue() as boolean);
      break;
    }

  }
}
```
The built-in Settings module currently exposes two things: a single check if the application has the `developer mode` setting enabled, and another that takes a callback as a parameter and uses the callback each time the `developer mode` status changes. External modules can 'subscribe' to the `developer mode` setting, if their module depends on it. 
    
### `async` `requestExternal(target: string, eventType: string, ...data: any[]): Promise<any>`
This function can be used to trigger an event in another module. Resolves with an `Error` if the target module is not found, or the return value from the request.

**Parameters:**
> **target**: string → The module ID of the target module.  
> **eventType**: string → The name of the event  
> **data**: any[] → Any data associated with the event.  

**Returns:**
> A Promise\<any> that resolves with the response of the request.

## Getters/Setters

### `getIPCSource(): string`
Returns the module ID.

### `getName(): string`
Returns the name of the module.

### `getSettings(): ModuleSettings`
Returns a reference to the ModuleSettings object associated with the module.

### `getHTMLPath(): string`
Gets the path to the HTML file as a string. This is used during the module loading process, but shouldn't be useful outside of that.

**Returns**:
> the path to the HTML file as a string.


## Other Functions

### `refreshAllSettings(): void`
This function passes each setting into the `refreshSettings` function as if they were modified. This function is only used in the module initialization process and should be used carefully.


### `setModuleInfo(moduleInfo: ModuleInfo): void`
This function is called when the controller parses the `moduleinfo.json` and attaches it to the module. This should not be used anywhere. 
<br/>
