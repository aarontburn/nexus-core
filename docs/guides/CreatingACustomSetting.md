# Nexus: Creating a Custom Setting

## Overview
While Nexus provides a set of built-in settings and UIs, you may want a setting specific to your module. This guide will walk you through the development of your custom setting.

## `Setting` vs. `SettingBox`
The parent class `Setting<T>` holds the behavior for the setting, while the parent class `SettingBox<T>` holds the behavior for the frontend. Essentially, the `Setting` is the backend, and the `SettingBox` is the frontend.

## Creating the `Setting`
1. Create a new class that extends the parent `Setting<T>`, where `T` is the datatype to store. 
2. Implement the constructor.
	```typescript
	public constructor(module: Process) {
		super(module);
	}
	```
	There is a bit of nuance here; if your setting has custom parameters that will influence the UI, return `true` in the call to `super`.
	```typescript
	public constructor(module: Process) {
		super(module, true);
	}
	```
	For example, the built-in `ChoiceSetting` has an additional function `addOptions` to add the choices. When the constructor is called, the `setUIComponent` relies on the options that have not been created yet, which is why we must defer the call by returning `true` in the constructor.   Whenever you make a change that can influence the UI, you **must** make a call to `this.reInitUI()` to properly reinitalize the UI.
	```typescript
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
	```typescript
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
	```typescript
	// StringSetting.ts
	public setUIComponent(): SettingBox<string> {
		return new StringSettingBox(this);
	}
	```
	Sometimes, this function can just be as simple as returning the corresponding `SettingBox`. However, if you need to modify the UI based on certain parameters, this can look a bit more complex.
	```typescript
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

