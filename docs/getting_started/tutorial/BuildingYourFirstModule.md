# Nexus: Building your First Module


## Required Tools
### Code Editor
You will need a text editor. Nexus was developed and tested using [Visual Studio Code](https://code.visualstudio.com/), which is what we recommend.

### Command Line
You will need access to a command line to run and export your module. Many IDEs come with an integrated terminal, but you can also use your operating systems native one.

### Node.js and npm
You will need to install [Node.js](https://nodejs.org/en/download/) and npm (which should be bundled with Node.js).


## Templates

Because each module requires quite a bit of configuration, it is **highly recommended** to use one of the provided templates to start developing your module. These templates are fully functional out of the box and provide everything you need to start.

Visit the tutorial for the template you want to develop with.


### [Nexus with React **(Recommended)**](./react/1%20ReactSetup.md) 
This template utilizes Vite + React + TypeScript to build your module.

This template is right for you if:
- You want to build a module with a UI
- You want to build your module using React + TypeScript

### [Nexus with Vanilla TypeScript](./vanilla/1%20VanillaSetup.md)
This template utilizes HTML + CSS + TypeScript. 

This template is right for you if:
- You want to build a module with a UI
- You want to build your module using Vanilla HTML + CSS + TypeScript
- You are okay with not being able to import other files within your renderer.

### [Nexus Internal Template](./internal/1%20InternalSetup.md)
This is to create modules with no GUI, useful for monitoring, adding additional settings, or interfacing with other modules.

This template is right for you if:
- You want to build a module WITHOUT a UI
- You want to build a module using TypeScript.

### [Nexus Webpage Template](./webpage/1%20WebpageSetup.md)
This is to quickly embed websites as a module.

This template is right for you if:
- You want to embed an existing webpage as a module.
- You want the option to embed an existing webpage as a part of your module.