
# Nexus: `Setting<T>` API

## Overview

The `Setting<T>` class defines a configurable setting that can be exposed to the user. It encapsulates both the setting’s data and behavior, and supports a fluent (chainable) API for building settings.

The class is designed to chain calls together when building them. For example:
```typescript
export default SampleProcess extends Process {
    public registerSettings(): (Setting<unknown> | string)[] {
        return [
            new BooleanSetting(this)
                .setDefault(false)
                .setName("Sample Toggle Setting")
                .setDescription("An example of a true/false setting.")
                .setAccessID('sample_bool'),
        ];
    }
}
```
This is the recommended format to build your setting. While specific setting implementations might have different required values, **all settings must have a display name (`.setName()`) and a default value (`.setDefault()`)**. If these fields aren't set, the setting will not be registered.

### See Also:
 [`ModuleSettings`](./ModuleSettings.md) → The class that manages all the settings in your module



## Prebuilt Settings

### [`BooleanSetting`](./setting_types/BooleanSetting.md)
Capture binary input (true/false, on/off).

### [`ChoiceSetting`](./setting_types/ChoiceSetting.md)
Present the user with a choice of options where they can select a single one.

### [`HexColorSetting`](./setting_types/HexColorSetting.md)
Capture color input as a hex color.

### [`NumberSetting`](./setting_types/NumberSetting.md)
Capture numerical input from the user as a slider or an input box.

### [`StringSetting`](./setting_types/StringSetting.md)
Capture string input from the user.



## Setting Building Functions
These functions are designed to chain off each other.

### `setName(name: string): Setting<T>`
Sets the display name of the setting. This field is **required**. This cannot be reassigned once set.
> **Parameters**  
> `name: string` → The name of the setting.  
> **Returns**  
> The instance of itself.

---

### `setDefault(defaultValue: T): Setting<T>`
Sets the default value of the setting. This field is **required**. This cannot be reassigned once set.
> **Parameters**  
> `defaultValue: T` → The default value of the setting.  
> **Returns**  
> The instance of itself.

---

### `setAccessID(id: string): Setting<T>`
Sets the access ID of the setting. This field is not required but is **highly recommended**. Cannot be reassigned once set.
> **Parameters**  
> `id: string` → The access ID of the setting.  
> **Returns**  
> The instance of itself.

---

### `setDescription(description: string): Setting<T>`
Sets the description of the setting. Cannot be reassigned once set.
> **Parameters**  
> `description: string` → The description of the setting.  
> **Returns**  
> The instance of itself.

---

### `setValidator(inputValidator: (input: any) => Promise<T | null> | T | null): Setting<T>`
Sets an input validator for the setting. This cannot be reassigned once set. For an example of how to use this, visit the [`StringSetting` Usage Information](./setting_types/StringSetting.md#usage-information) for an example.
> **Parameters**  
> `inputValidator: (input: any) => Promise<T | null> | T | null` → An input validator function that checks and sanitizes the input. If it returns null, the value is rejected. This function **can** be async if your setting requires an async call to validate the value.  
> **Returns**  
> The instance of itself.



## Getter/Setter Methods

### `getAccessID(): string`
> **Returns**  
> The access ID of the setting. If the ID isn't set, returns the display name instead.

---

### `getName(): string`
> **Returns**  
> The name of the setting.

---

### `getDescription(): string`
> **Returns**  
> The description of the setting. If the description is not, returns an empty string (`""`).

---

### `getValue(): T`
> **Returns**  
> The value of the setting.

--- 

### `[async] setValue(value: any): Promise<void>`
Sets the value of the setting. `value` is first parsed into `T` before assigning it to the setting. If `value` isn't a valid type of `T` (either by different type or failing the validator's tests), this will not modify the current value. 

This function is async because the validation process could be async.

> **Parameters**  
> `value: any` → The value to set the setting to.   
> **Returns**  
> A `Promise` that resolves to `void` when the setting finishes setting the value.   

--- 

### `[async] resetToDefault(): Promise<void>`
Resets the value of the setting back to its default value specified from `.setDefault()`. 

> **Returns**  
> A `Promise` that resolves to `void` when the resetting process finishes.   




## Functions Used Internally (do not use)

### `getID(): string`
Retrieves the ID of the setting. This is only used internally. The ID is randomly generated during each boot of Nexus and should not be used elsewhere.
> **Returns**  
> The temporary ID of the setting.

---

### `setUIComponent(): SettingBox<T>`
This defines the UI of the setting. This is only used internally and should not be called anywhere.

---

### `getUIComponent(): SettingBox<T>`
This is used to get the UI of the setting. This is only used internally and should not be called anywhere.