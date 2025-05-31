# Nexus: Webpage Template Terminal Commands

This section is to help you understand some of the commands defined within the `package.json`.

---
Within the `package.json` at the root of your project, the `scripts` field may look like:
```jsonc
// package.json
// ...

"scripts": {
    "start": "npm run export:dev && electron ./node_modules/@nexus-app/nexus-client/main.js --dev",
    "export": "node node_modules/@nexus-app/nexus-exporter/exporter.js",
    "export:dev": "node node_modules/@nexus-app/nexus-exporter/exporter.js --dev"
},

// ...
```
These commands are ran via:
```
npm run <command name>
```
## Command Overview
Useful Commands:
- `npm start`: Run Nexus in developer mode.
- `npm run export`: Export your module for distribution.
  
---
Commands you can ignore:  
- `npm run export:dev`: Dev-only fast export (used internally).


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

#### `npm run export:dev`
This exports your module directly to `C:\Users\<user home>\.nexus_dev\external_modules` for quick testing. There is very little purpose to run this function instead of `npm start`.

## Next Steps
Learn about [Exporting and Configuration](../ConfigurationAndExport.md) to finalize up your module.