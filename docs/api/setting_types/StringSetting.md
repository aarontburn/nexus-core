# Nexus: `StringSetting` API

## Overview
`StringSetting` is used to capture text input from the user.

## Example
![image](https://github.com/aarontburn/modules-module-quickstart/assets/103211131/c1100d28-86fb-48b3-a0b3-ec131889d560)

``` typescript
public registerSettings(): (Setting<unknown> | string)[] {
	return [
        "String Setting", // Section Header
        
        new StringSetting(this)
          .setName("Example String Setting") // Set name (required)
          .setDescription("This is a setting to take text input from the user!") // Set description
          .setDefault("Example Text"), // Set default value (required),
    ];
}
```

## Usage Information
Because the possible values for this setting type is so broad, you can use the `setValidator` function to create a custom validator for the setting without creating a new setting type.

For example, the `Home` module uses a modified `StringSetting` to ensure the only possible characters within it are whitespace, or 1 through 4.

Returning `null` indicates that the input is invalid and should not be registered. 

```typescript
new StringSetting(this)
    .setName("Display Order")
    .setDescription("Adjusts the order of the time/date displays.")
    .setDefault("12 34")
    .setAccessID("display_order")
    .setValidator((o) => {
        const s: string = o.toString();
        return s === "" || s.match("^(?!.*(\\d).*\\1)[1-4\\s]+$") ? s : null;
    }),
```


