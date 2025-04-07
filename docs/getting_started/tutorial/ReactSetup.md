# Nexus: React


## Project Structure
After downloading the template and running `npm install`, your project should look something like this:

```
root/
+-- node_modules/
+-- src/
    +-- process/
        +-- main.ts

    +-- renderer/
        +-- react-wrapper/
            +-- ...

        +-- index.html
        +-- renderer.ts

    +-- export-config.js
    +-- module-info.json

+-- .gitattributes
+-- .gitignore
+-- electron.ts
+-- package-lock.json
+-- package.json
+-- README.md
+-- tsconfig.json
```
Let's break down each section of the project.


### Low Maintenance Files
Starting with root files and directories that are self-explanatory, unchanged from standard Node.js projects, or will require very little configuration:

- `node_modules/`: This is where dependencies are installed.
- `.gitattributes`: Standard [git attributes](https://git-scm.com/docs/gitattributes).
- `.gitignore`: Standard [.gitignore](https://git-scm.com/docs/gitignore).
- `package-lock.json`: Standard [package-lock.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json).
- `README.md`: Standard [README.md](https://docs.github.com/en/repositories/.managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes). Change this to show off your module.
- `electron.ts`: This file is used to let your editor know that Electron is being used. This file is ignored and should not be modified.   
- `tsconfig.json`: Standard [tsconfig.json](https://www.typescriptlang.org/tsconfig/); modified to remove `/react-wrapper/`, which is mentioned later.
- `package.json`: Standard [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json). However, this does list many commands you may be using throughout development. See the [Commands](#cli-commands) section for more information.

### The Important Stuff
By default, the `src/` folder is set up how standard MVC applications are organized, but the file structure can be modified. However, all files used by your module **need to stay within the `src/` directory.**

```
root/
+-- src/
    +-- process/
        +-- main.ts

    +-- renderer/
        +-- react-wrapper/
            +-- ...

        +-- index.html
        +-- renderer.ts

    +-- export-config.js
    +-- module-info.json
```
- `src/`: This is the folder that will be converted into your module and should contain ALL of your source code and assets.
- `src/export-config.js`: A file containing export configurations for your module. Read the [Exporting](link) section for more details.
- `src/module-info.json`: A file containing details about your module. Read the [Exporting](link) section for more details.
- `src/process/`: The directory containing all code and assets for the process (backend).
- `src/process/main.ts`: The entry point to your module and the main [Process](link). If you move or rename this file, ensure your changes are also reflected in `export-config.js` (read about [export-config.js](link)).  
- `src/renderer/`: The directory containing all code and assets for the renderer (frontend).
- `src/renderer/index.html`: A bare-bones HTML file. Because we are using React, this file **does not need to be modified**, and only contains code to host our React application. 
- `src/renderer/renderer.ts`: This file interfaces between the process and the React webpage, and its purpose is to pass data between them. You likely won’t need to modify this unless you're changing the dev server config.
- `src/renderer/react-wrapper/`: This is where your React application is stored. Within this folder is an entire Vite + React + TypeScript application.

### The React Wrapper
Within the `react-wrapper/` directory is a full Vite + React + TypeScript application using [Vite's React + TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).

```
root/
+-- src/
    +-- renderer/
        +-- react-wrapper/
            +-- node_modules/
            +-- src/
                +-- assets/
                    +-- ...

                +-- App.css
                +-- App.tsx
                +-- index.css
                +-- main.tsx
                +-- ModulesBridge.ts
                +-- vite-env-d.ts

            +-- index.html
            +-- package-lock.json
            +-- package.json
            +-- tsconfig.app.json
            +-- tsconfig.json
            +-- tsconfig.node.json
            +-- vite.config.ts
```

Here are the files that are important:
- `App.tsx`: Where your source code is located.
- `ModulesBridge.ts`: This file contains methods used to communicate with your process.

---
### Next Steps:
Now that you've understood how the project is laid out, visit the [Process](./TheProcess.md) guide to learn how it works.