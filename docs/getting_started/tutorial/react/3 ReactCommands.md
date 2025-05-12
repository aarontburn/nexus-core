# Nexus: React Template Terminal Commands


This section is to help you understand some of the commands defined within the `package.json`.

---
Within the `package.json` at the root of your project, the `scripts` field may look like:
```jsonc
// package.json
"config": {
    "react-wrapper-directory": "./src/renderer/react-wrapper"
},
"scripts": {
    "start": "npm-run-all --parallel vite:start electron-start",
    "export": "npm run vite:build && node node_modules/@nexus-app/nexus-exporter/exporter.js",
    "dev_export": "npm run vite:build && node node_modules/@nexus-app/nexus-exporter/exporter.js --dev",
    "preinstall": "cd %npm_package_config_react-wrapper-directory% && npm install",
    "vite:build": "cd %npm_package_config_react-wrapper-directory% && npm run build",
    "vite:start": "cd %npm_package_config_react-wrapper-directory% && npm run dev",
    "electron-start": "npm run dev_export && electron ./node_modules/@nexus-app/nexus-client/main.js --dev"
}
```
These commands are ran via:
```
npm run <command name>
```

The `config` field is a variable to the React wrapper. If you rename the react-wrapper, you will also need to modify `react-wrapper-directory`.

This structure may change if it is depreciated in future versions of `npm`.

## Command Overview
Useful Commands:
- `npm start`: Run Nexus in developer mode
- `npm run export`: Export your module for distribution   
  
---
Commands you can ignore:  
- `npm run dev_export`: Dev-only fast export (used internally)
- `npm run vite:build`: Builds React wrapper manually
- `npm run vite:start`: Starts dev server for React wrapper
- `npm run preinstall`: Installs React wrapper packages
- `npm run electron-start`: Launches Nexus manually (not recommended)

## Command Details
### Useful Commands
#### `npm start`
This is the entry point to Nexus.

This command automatically exports your module to `C:\Users\<user home>\.nexus_dev\external_modules` and opens Nexus, which will automatically compile and load your module.

#### `npm run export`
This command exports your module for production. Use this command when you finish developing your module and plan on distributing it.

This will open a file location chooser, and will save your module in a `.zip` folder named the `id` found in `module-info.json`. If no location is chosen (via the `cancel` or `X` button), it will save in an `output` directory in the root of your project.

---

### Commands to Ignore
These commands are used under-the-hood or during initial project setup. You normally should not need to run these commands manually.

#### `npm run dev_export`
This exports your module directly to `C:\Users\<user home>\.nexus_dev\external_modules` for quick testing. There is very little purpose to run this function instead of `npm start`.

#### `npm run vite:build`
This command navigates to the `react-wrapper` directory and builds the Vite project, which will output it as a single file within the `react_module` directory. There should be no reason to run this command instead of running `npm run dev_export` or `npm run export`.

#### `npm run vite:start`
This command navigates to the `react-wrapper` directory and starts the Vite project on a development server. There should be no reason to run this command instead of running `npm start`.

#### `npm run preinstall`
This command installs all required packages within the `react-wrapper` directory. Ran automatically during `npm install`. This command only needs to be run manually to reinstall any `node_modules` within the React directory.

#### `npm run electron-start`
This command exports your module directly to `C:\Users\<user home>\.nexus_dev\external_modules` and initializes the Nexus. However, because you will need to rebuild the contents of `react-wrapper`, this should not be ran independently.

## Next Steps
Learn about [Exporting and Configuration](../ConfigurationAndExport.md) to finalize up your module.