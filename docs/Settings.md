
### Modules: Settings
Author: [@aarontburn](https://github.com/aarontburn)  
Guide for [Modules](https://github.com/aarontburn/modules)


# All Things Settings
The _Modules_ platform aims to streamline the creation of any module, including the management of settings. This portion of the documentation hopes to explain the various setting types and their use cases.

All _modules_ will have their settings handled by the built-in Settings module.


# Table of Contents

1. [The `Setting` Class](#the-setting-class)




# Getting Started

The `Process` API aims to streamline the creation and management of your modules' settings.


#### `registerSettings(): (Setting<unknown> | string)[]`
All modules have use this function to register settings for their module. If your module doesn't depend on any settings, this can simply return an empty array. Otherwise, you can easily create settings by adding a `Setting` object to the array.

## Example
```
public registerSettings(): (Setting<unknown> | string)[] {
  return [
    new BooleanSetting(this)
      .setDefault(false)
      .setName("Sample Toggle Setting")
      .setDescription("An example of a boolean setting!")
      .setAccessID('sample_bool'),
  ]
}
```
This sample code will result in a UI such as:

![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/ae75ef8e-2390-4c96-92ad-01b5f9e003e6)

In the `registerSettings` function, we simply return an array that has a `BooleanSetting`, which is a descendent of the `Setting` parent class, and specify certain parameters.

There are **two required parameters**, those of which being the **setting name** and **default value**. However, there are several optional parameters that can help access or modify your setting. See the [Setting class](#the-setting-class) section for more details.




# Accessing a setting within the `Process`

Within your Process class, all settings are stored within the `ModuleSettings` class. 


### Internal Summary
When a setting is added to this object via the `_addSetting` or `_addSettings` function, they are indexed by their `name` and their `accessID` (if applicable),  



#### `this.getSettings(): ModuleSettings`
is the function used to access this class. This class has a couple functions.


## `ModuleSettings` Class

#### `getSetting(nameOrID: string): Setting<unknown>`
```
// Process.ts
this.getSettings().getSetting("sample_setting_ID")
```
The standard function to access a specific setting.

**Parameters:**
> **nameOrID**: string → The setting name (defined by the required `setName` function), or access ID (defined by the optional `setAccessID` function).   

**Returns:**
> The setting with the matching name or access ID, or undefined if the setting does not exist.


## `refreshSettings(modifiedSetting: Setting<unknown>)`
Whenever a setting is modified, the `refreshSettings` function will be called with the modified setting passed as an argument. Using the `modifiedSetting` argument, you can obtain its name (or access ID) and use a `switch-case` or an `if` statement to define the behavior when settings are modified. 

```
// Process.ts
public refreshSettings(modifiedSetting: Setting<unknown>): void {
	if (modifiedSetting.getAccessID() === 'sample_bool') {
		this.sendToRenderer('sample-setting', modifiedSetting.getValue());
	}
}
```
**Parameters:**
> **modifiedSetting**: Setting\<unknown> → The modified setting. 





# The `Setting` Class

This parent class encapsulates all behavior required for each setting. 

### Functions

#### `setName(name: string)` `REQUIRED`
Sets the name of the setting. 

#### `setDefault(defaultValue: T)` `REQUIRED`
Sets the default value of the setting.

#### `setDescription(description: string)`
Sets the description of the setting.

#### `setAccessID(id: string)`
Sets the access ID of the setting.

The access ID is a way to query the setting after it is stored in the `ModuleSettings` object. Without an access ID, you will only be able to query a setting by its name, which can be susceptible to typos.

The access ID can be anything, but it has to be unique. For best practices, use all lowercase letters and avoid whitespace.

```
// Process.ts
new NumberSetting(this)
    .setName("Example Default Number Setting")
    .setDescription("This is the default numeric setting.")
    .setDefault(5)
    .setAccessID('example_number_setting');
    
// Which can be accessed via
// ...
this.getSettings().getSetting('example_number_setting');

// Instead of:
this.getSettings().getSetting('Example Default Number Setting');
```





# Prebuilt Settings


## `NumberSetting`
This setting type is used to take numeric input from the user.

### Unique Functions

#### `useRangeSliderUI()`
Changes the default UI to use a slider.

#### `useNonIncrementableUI()`
Changes the default UI to use a non-incrementable version (does not have clickable `-` or `+` buttons).

#### `setMin(min: number)`
Modifies the setting to have a minimum. If the user attempts to enter a number less than the minimum, the setting will be set to the minimum.

**Throws**
> An `Error` if the minimum is greater than the settings' maximum. 

#### `setMax(max: number)`
Modifies the setting to have a maximum. If the user attempts to enter a number greater than the maximum, the setting will be set to the maximum.

**Throws**
> An `Error` if the maximum is less than the settings' minimum. 


#### `setRange(min: number, max: number)`
Gives the setting a minimum and maximum. If the user attempts to enter a number out-of-bounds, it will be set to the closest number in-bounds (min or max). 

**Throws**
> An `Error` if the minimum is greater than the maximum. 


### Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/1054a3a5-6c5b-454e-9cba-8bb543514e20)

This image can be produced from the following code:

```
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        // ...
		"Numeric Settings",																// Section Header
        
        new NumberSetting(this)
          .setName("Example Default Number Setting")									// Set name (required)
          .setDescription("This is the default numeric setting.")						// Set description
          .setDefault(5),																// Set default value (required)

        new NumberSetting(this)
          .useNonIncrementableUI()														// Use the non-incrementable UI
          .setName("Example Non-Incrementable Number Setting")
          .setDescription("This is a numeric setting WITHOUT the + or - buttons.")
          .setDefault(5),

        new NumberSetting(this)
          .useRangeSliderUI()															// Use the slider UI
          .setName("Example Slider Number Setting")
          .setDescription("This is a numeric setting as a slider.")
          .setDefault(5),

        new NumberSetting(this)
          .setRange(5, 25)																// Define a lower and upper bound
          .setStep(5)																	// Define the increment amount (default is 1)
          .setName("Example Number Setting with bounds")
          .setDescription("This is a numeric setting confined to a range of [5, 25].")
          .setDefault(10),

        new NumberSetting(this)
          .setMin(15)																	// Define a lower bound
          .setName("Example Number Setting with a lower-bound")
          .setDescription("This is a numeric setting confined to a range of [15, ∞).")
          .setDefault(25),

        new NumberSetting(this)
          .setMax(100)																	// Define an upper bound
          .setName("Example Number Setting with an upper-bound")
          .setDescription("This is a numeric setting confined to a range of (-∞, 100].")
          .setDefault(45),
        // ...
    ];
}
```


## `ChoiceSetting`
This setting is when you want to present the user with defined options where they can choose a **single** one.

### Unique Functions

#### `useDropdown()`
Changes the default UI from radio buttons to a dropdown.

#### `addOption(option: string)`
Adds a single option to the possible options. See `addOptions(...options: string[])`

#### `addOptions(...options: string[])`
Adds multiple options at once. Any duplicate options will not be added.

#### `getOptionNames(): Set<string>`
Returns a Set containing all possible options.

### Example

![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/d515f08a-db53-4b51-b627-84be73842ab6)

This image can be produced from the following code:

```
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        // ...
        "Selection Settings",															// Section header

        new ChoiceSetting(this)
          .addOptions("Apple", "Orange", "Banana", "Kiwi")								// Add options
          .setName("Example Default Choice Setting")									// Set name (required)
          .setDescription("This is an example of the ChoiceSetting as radio buttons.")	// Set description
          .setDefault("Banana"), 														// Set default value (required)

        new ChoiceSetting(this)
          .useDropdown()																// Use the dropdown UI instead
          .addOptions("Blueberry", "Raspberry", "Pineapple", "Grape")
          .setName("Example Choice Setting as a Dropdown")	
          .setDescription("This is an example of the ChoiceSetting as a dropdown!")
          .setDefault("Grape"),
        // ...
    ];
}
```

## `HexColorSetting`
This setting is used to capture color input from the user. The color is saved as hex color.

### Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/cf399cc6-91b7-4199-bba3-f12e6217744f)

```
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        // ...
        "Color Setting",											// Section Header
        
        new HexColorSetting(this)
            .setName("Example Color Setting")						// Set name (required)
            .setDescription("This is a setting to manage color!")	// Set description
            .setDefault("#74f287"),									// Set default value (required)
        // ...
    ];
}
```

## `StringSetting`
This setting is used to capture text input from the user.


### Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/c1100d28-86fb-48b3-a0b3-ec131889d560)

```
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        // ...
        "String Setting",															// Section Header
        
        new StringSetting(this)
          .setName("Example String Setting")										// Set name (required)
          .setDescription("This is a setting to take text input from the user!")	// Set description
          .setDefault("Example Text"),												// Set default value (required)
        // ...
    ];
}
```


## `BooleanSetting`
This setting is used to capture boolean input from the user.


### Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/1d840602-6604-408c-bea4-5d7c9d1f9ca7)

```
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        // ...
        "Boolean Setting",														// Section Header
        
        new BooleanSetting(this)
            .setName("Example Boolean Setting")									// Set name (required)
            .setDescription("This is the setting to manage boolean state.")		// Set description
            .setDefault(false),													// Set default value (required)
        // ...
    ];
}
```


# Creating a Custom Setting
If your module demands a more advanced setting type, the provided API's aim to allow easy development of custom settings.

## `Setting` vs. `SettingBox`
The parent class `Setting<T>` holds the behavior for the setting, while the parent class `SettingBox<T>` holds the behavior for the frontend. Essentially, the `Setting` is the backend, and the `SettingBox` is the frontend.

## Creating the `Setting`
1. Create a new class that extends the parent `Setting<T>`, where `T` is the datatype to store. 
2. Implement the constructor.
	```
	public constructor(module: Process) {
		super(module);
	}
	```
	There is a bit of nuance here; if your setting has custom parameters that will influence the UI, return `true` in the call to `super`.
	```
	public constructor(module: Process) {
		super(module, true);
	}
	```
	For example, the built-in `ChoiceSetting` has an additional function `addOptions` to add the choices. When the constructor is called, the `setUIComponent` relies on the options that have not been created yet, which is why we must defer the call by returning `true` in the constructor.   Whenever you make a change that can influence the UI, you **must** make a call to `this.reInitUI()` to properly reinitalize the UI.
	```
	// ChoiceSetting.ts
	public addOptions(...options: string[]): ChoiceSetting {
		for (const option of options) {
			this.options.add(option);
		}
		this.reInitUI();
		return this;
	}
	```
	As the name suggests, the `reInitUI` function reinitializes the `SettingBox` component defined by the `setUIComponent` function.
3. Implement the `validateInput` function.
	```
	// BooleanSettings.ts
	public validateInput(input: any): string | null {
		if (input === null) {
			return null;
		}
		if (typeof input === "boolean") {
			return input;
		}
		const s: string = JSON.stringify(input).replace(/"/g, '');
		if (s === "true") {
			return true;
		} else if (s === "false") {
			return false;
		}
		return null;
	}
	```
	This function is used to take a variable of an unknown data type and parse it into an input your setting can process. To streamline this, convert the input into a string via `JSON.stringify(input).replace(/"/g, '')` (and remove any leading/trailing `"`), and parse the input from there.

	This function MUST return `null` if the input is invalid and should not be accepted, which in this case, will revert the settings' value to its previous state. 

4. Implement the `setUIComponent` function.

	This function should return a **new** instance of a `SettingBox` .
	```
	// StringSetting.ts
	public setUIComponent(): SettingBox<string> {
		return new StringSettingBox(this);
	}
	```
	Sometimes, this function can just be as simple as returning the corresponding `SettingBox`. However, if you need to modify the UI based on certain parameters, this can look a bit more complex.
	```
	// NumberSetting.ts
	public setUIComponent(): SettingBox<number> {
		if (this.useSlider) {
			const slider: RangeSettingBox = new RangeSettingBox(this);
			slider.setInputRange(this.min, this.max);
			slider.setInputStep(this.step);
			return slider;

		} else if (this.withoutIncrement) {
			return new NumberSettingBox(this);
		}

		const box: IncrementableNumberSettingBox = new IncrementableNumberSettingBox(this);
		box.setInputRange(this.min, this.max);
		box.setInputStep(this.step);
		return box;
	}
	```
## Creating the `SettingBox`
Creating the UI component is a bit more complex.

![Screenshot 2024-07-07 202357](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/cc7bcea4-8635-454a-b222-6801b23a2d70)

To create a consistant styling, by default, there is a left component and a right component. 

> The left component, highlighted in red, is small and meant for smaller input boxes, such as number or color input. 

> The right component, highlighed in purple, extends for the rest of the window size. This means it can fit larger elements, such as the name, description, and larger input boxes, such as a dropdown or text input.

You ARE able to override this default margining, which will be discussed later.

1. Create a new class that extends the parent `SettingBox<T>`, where `T` is the same type of the corresponding `Setting`
2. 

