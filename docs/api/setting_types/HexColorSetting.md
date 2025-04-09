# Nexus: `HexColorSetting` API

## Overview
`HexColorSetting` is used to capture color input from the user. The color is saved as a `string` hex color.

## Config Functions
`HexColorSetting` does not have any unique configuration functions.

### Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/cf399cc6-91b7-4199-bba3-f12e6217744f)

```typescript
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        "Color Setting", // Section Header
        
        new HexColorSetting(this)
            .setName("Example Color Setting") // Set name (required)
            .setDescription("This is a setting to manage color!") // Set description
            .setDefault("#74f287"), // Set default value (required)
    ];
}
```
