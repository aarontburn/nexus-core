# Nexus: `ChoiceSetting` API

## Overview
The `ChoiceSetting` when you want to present the user with options where they can choose a **single** one.

## Config Functions

### `useDropdown()`
Changes the UI from radio buttons to a dropdown selector.

### `addOption(option: string)`
Adds a single option to the possible options. **Duplicate options will be ignored.** See `addOptions(...options: string[])`
> **Parameters**  
> `option: string` → The option to add.


### `addOptions(...options: string[])`
Adds multiple options at once. **Duplicate options will be ignored.**
> **Parameters**  
> `options: string[]` → An array of options to add.

## Example

![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/d515f08a-db53-4b51-b627-84be73842ab6)


``` typescript
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        "Selection Settings", // Section header

        new ChoiceSetting(this)
          .addOptions("Apple", "Orange", "Banana", "Kiwi")  // Add options
          .setName("Example Default Choice Setting") // Set name (required)
          .setDescription("This is an example of the ChoiceSetting as radio buttons.")	// Set description
          .setDefault("Banana"), // Set default value (required)
        
        new ChoiceSetting(this)
          .useDropdown() // Use the dropdown UI instead
          .addOptions("Blueberry", "Raspberry", "Pineapple", "Grape")
          .setName("Example Choice Setting as a Dropdown")	
          .setDescription("This is an example of the ChoiceSetting as a dropdown!")
          .setDefault("Grape")
    ];
}
```