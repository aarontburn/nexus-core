# Nexus: `ModuleSettings` API

## Overview
The ModuleSettings class manages all settings tied to your module, including access, retrieval, and display metadata.

Each setting in a module is an instance of `Setting<T>`, and this class is used to organize them.

All descendants of the `Process` class have an instance of a `ModuleSettings` handler, and can be accessed such as: 


```typescript
export default class SampleProcess extends Process {
    // ...

    public initialize(): void {
        const moduleSettings: ModuleSettings = this.getSettings();
        console.log(moduleSettings.findSetting("sample_setting").getValue());
	}

    // ...
}
```

## Functions

### `getDisplayName(): string`
> **Returns**  
> The display name of the setting group. If a name isn't defined by [`setDisplayName`](#setdisplaynamename-string-void), this will return the module name.

---

### `toAllArray(): Setting<unknown>[]`
> **Returns**  
> An array of all settings associated with this module.

---

### `findSetting(nameOrAccessID: string): Setting<unknown> | undefined`
> **Parameters**  
> `nameOrAccessID: string` → The name of the setting, or the access ID (if set).  
> **Returns**  
> The setting matching the provided name or access ID. If none is found, returns `undefined`.

---

### `setDisplayName(name: string): void`
Modifies the display name of the module settings, changing the name in the Settings tab. Useful when you want to provide a more user-friendly or localized name.
> **Parameters**  
> `name: string` → The new display name.


## Functions used Internally (do not use)

### `getSettingsAndHeaders(): (Setting<unknown> | string)[]`
Retrieves both user-defined headers and associated settings, for display in the Settings UI.
> **Returns**  
> An array containing both the headers and settings of this module.

---

### `getProcess(): Process`
> **Returns**  
> A reference to the original source Process.
