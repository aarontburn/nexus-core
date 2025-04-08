# Nexus: Vanilla TS Template Setup

## Installation

Download the provided template.

### [Nexus with Vanilla TypeScript](https://github.com/aarontburn/nexus-template-vanilla-ts)
<sup>or https://github.com/aarontburn/nexus-template-vanilla-ts</sup>

Once downloaded, open your text editor to the root directory of the project. Open a CLI in the same location and run

```
npm start
```
To install the required packages.

To get a grasp on the program, (still in the root directory), run the command:
```
npm start
```
to start Nexus with your module loaded.


## Project Structure
After downloading the template and running `npm install`, your project should look something like this:
```
root/
+-- node_modules/
+-- src/
    +-- process/
        +-- main.ts

    +-- renderer/
        +-- assets/
            +-- ...

        +-- index.html
        +-- renderer.ts
        +-- styles.css

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
- `tsconfig.json`: Standard [tsconfig.json](https://www.typescriptlang.org/tsconfig/).
- `package.json`: Standard [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json). However, this does list many commands you may be using throughout development. See the [Commands](#cli-commands) section for more information.



### Key Project Files
By default, the `src/` folder is set up how standard MVC applications are organized, but the file structure can be modified. However, all files used by your module **need to stay within the `src/` directory.**

```
root/
+-- src/
    +-- process/
        +-- main.ts

    +-- renderer/
        +-- assets/
            +-- ...

        +-- index.html
        +-- renderer.ts
        +-- styles.css

    +-- export-config.js
    +-- module-info.json
```
- `src/`: This is the folder that will be converted into your module and should contain ALL of your source code and assets.
- `src/export-config.js`: A file containing export configurations for your module. Read the [Exporting](link) section for more details.
- `src/module-info.json`: A file containing details about your module. Read the [Exporting](link) section for more details.
- `src/process/`: The directory containing all code and assets for the process (backend).
- `src/process/main.ts`: The entry point to your module and the main [Process](link). If you move or rename this file, ensure your changes are also reflected in `src/export-config.js` (read about [export-config.js](link)).  
- `src/renderer/`: The directory containing all code and assets for the renderer (frontend).
- `src/renderer/index.html`: The default UI for your module.
- `src/renderer/renderer.ts`: The main logic file for the renderer. It listens for messages from the process and interacts with the DOM accordingly.
- `src/renderer/styles.css`: The styling for `index.html`.
- `src/renderer/assets/`: This folder can be used to hold images, fonts, or any other assets your renderer may use.

The renderer is nearly identical to web development on the browser. The main difference is that `renderer.ts` is responsible for connecting your process and renderer.


---
### Next Steps:
Now that you've understood how the project is laid out, visit the [Process](../ProcessOverview.md) guide to learn how it works.
