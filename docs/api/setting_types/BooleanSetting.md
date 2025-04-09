# Nexus: `BooleanSetting` API


## Overview
`BooleanSetting` is used to capture boolean input from the user.

## Config Functions
`BooleanSetting` does not have any unique configuration functions.

## Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/1d840602-6604-408c-bea4-5d7c9d1f9ca7)

```typescript
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        "Boolean Setting", // Section Header
        
        new BooleanSetting(this)
            .setName("Example Boolean Setting") // Set name (required)
            .setDescription("This is the setting to manage boolean state.") // Set description
            .setDefault(false) // Set default value (required)
    ];
}
```
