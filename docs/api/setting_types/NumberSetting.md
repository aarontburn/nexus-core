# Nexus: `NumberSetting` API

## Overview
`NumberSetting` is used to take numeric input from the user. It comes has three possible UI types

## Unique Functions

### `useRangeSliderUI()`
Changes the default UI to use be slider.

---

### `useNonIncrementableUI()`
Changes the default UI to use be non-incrementable version (does not have clickable `-` or `+` buttons).

---

### `setMin(min: number)`
Modifies the setting to have a minimum. If the user attempts to enter a number less than the minimum, the setting will be set to the minimum.

> **Parameters**  
> `min: number` → The minimum possible value of the input.  
> **Throws**  
> `Error` if the minimum is greater than the settings' maximum. 
---

### `setMax(max: number)`
Modifies the setting to have a maximum. If the user attempts to enter a number greater than the maximum, the setting will be set to the maximum.

> **Parameters**  
> `max: number` → The maximum possible value of the input.  
> **Throws**  
> `Error` if the maximum is less than the settings' minimum. 

---

### `setRange(min: number, max: number)`
Gives the setting a minimum and maximum. If the user attempts to enter a number out-of-bounds, it will be set to the closest number in-bounds (min or max). 

> **Parameters**  
> `max: number` → The maximum possible value of the input.  
> `min: number` → The minimum possible value of the input.  
> **Throws**  
> `Error` if the minimum is greater than the maximum. 


## Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/1054a3a5-6c5b-454e-9cba-8bb543514e20)

This image can be produced from the following code:

```typescript
public registerSettings(): (Setting<unknown> | string)[] {
	return [
		"Numeric Settings", // Section Header
        
        new NumberSetting(this)
          .setName("Example Default Number Setting") // Set name (required)
          .setDescription("This is the default numeric setting.") // Set description
          .setDefault(5), // Set default value (required)

        new NumberSetting(this)
          .useNonIncrementableUI() // Use the non-incrementable UI
          .setName("Example Non-Incrementable Number Setting")
          .setDescription("This is a numeric setting WITHOUT the + or - buttons.")
          .setDefault(5),

        new NumberSetting(this)
          .useRangeSliderUI() // Use the slider UI
          .setName("Example Slider Number Setting")
          .setDescription("This is a numeric setting as a slider.")
          .setDefault(5),

        new NumberSetting(this)
          .setRange(5, 25) // Define a lower and upper bound
          .setStep(5) // Define the increment amount (default is 1)
          .setName("Example Number Setting with bounds")
          .setDescription("This is a numeric setting confined to a range of [5, 25].")
          .setDefault(10),

        new NumberSetting(this)
          .setMin(15) // Define a lower bound
          .setName("Example Number Setting with a lower-bound")
          .setDescription("This is a numeric setting confined to a range of [15, ∞).")
          .setDefault(25),

        new NumberSetting(this)
          .setMax(100) // Define an upper bound
          .setName("Example Number Setting with an upper-bound")
          .setDescription("This is a numeric setting confined to a range of (-∞, 100].")
          .setDefault(45),
    ];
}
```