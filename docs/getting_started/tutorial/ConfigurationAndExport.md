# Nexus: Module Configuration and Exporting

## Overview
This section covers `module-info.json`.

```
root
+-- src/
    +-- module-info.json
    +-- ...

+-- ...
```

Located within the `src/` directory of your project is `module-info.json`. This files are used during both production and exporting.

## `module-info.js`
Note: Paths within this file are relative from the `src/` directory, **not the root directory of the project**.

This file stores important constants to your module and defines how your module is exported.

Although the templates are pre-configured, you’ll still need to update `name` and `id` to reflect your module’s information. See the documentation below for specific rulesets about naming.


Taken from the [module-info.json documentation](../../api/module-info.json.md):
> ### `name: string` (*required*)
> The display name of your module.
> - `name` cannot be undefined.
> - `name` must be a string.
> - `name` cannot only contain whitespace or be an empty string.
> 
> 
> ### `id: string` (*required*)
> The ID of your module.
> - `id` cannot be undefined.
> - `id` must be a string.
> - `id` must be in the format `<developer_name>.<module_name>`
>   - `id` must have one (and only one) period ('.') separating the developer name and the > module name.
>   - `id` cannot contain whitespace or be an empty string.
>   - `id` cannot contain special characters besides a single period ('.') and underscores ('_').


## Exporting your module
Once you’ve configured `module-info.json`, you can export your module for production by running the following command from the root directory of your project:

```
npm run export
```

To export your module. This will open a file picker where you can choose the location to save your module; if no location is chosen (via the `cancel` or `x` button), it will save it in an `output/` folder in the root directory of your project.

Your module will be exported as `<id>.zip`, where `<id>` is the `id` defined in `module-info.json`. This should NOT be modified.

Make sure you increment your version number accordingly.

And that's it! You can easily distribute this `.zip` to the Nexus marketplace and import it into your Nexus client from the Settings.