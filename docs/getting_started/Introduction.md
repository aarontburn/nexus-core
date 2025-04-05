# Nexus

## What is Nexus?
Nexus is an application environment and loader. Developers can create applications, or **modules**, that can be loaded into the Nexus environment, keeping everything in one place. 

Think of Nexus as a customizable toolbox — one app that can do anything you (or the community) build into it.

## What is a module?

A **module** can be anything you can create in Node.js. From anything from a [system volume controller](https://github.com/aarontburn/nexus-volume-controller) to an [internal debug console](https://github.com/aarontburn/nexus-debug-console), there are no limits to what you can create. 


The benefit of developing with Nexus is that any module you install can be loaded into a single application, reducing window clutter, and Nexus provides an extensive framework to allow for module interconnectivity and ease-of-development.


**Application Lifecycle Handling**: Built-in and easily-modifiable functions are called during different parts of the application lifecycle, such as when your module is opened, closed, and initialized.

**User Configuration Settings**: Nexus provides a simple way to create and handle settings that your module may want the user to configure. Simply provide the settings you want to expose, and Nexus will create the UI, event handling, and do the storage reading/writing for you.

**Storage Handling**: Built-in classes and methods make it easy to read/write from storage.

**Module Communication**: Modules have the ability to communicate with each other and expose an API that other modules can access, which allows for interconnectivity and extensibility.

**Export and Distribution**: Nexus comes pre-configured to export your module into an archive file for easy distribution without much (or any) configuration.



## Developing a module with Nexus

> To get started with developing a module, visit any of the template repositories.  
> [Nexus React Template](https://github.com/aarontburn/nexus-template-react) (**recommended**): Develop a module using Vite + React + TypeScript.  
> [Nexus Vanilla TypeScript Template](https://github.com/aarontburn/nexus-template-vanilla-ts): Develop a module using HTML + CSS + TypeScript.  
> [Nexus Internal Template](https://github.com/aarontburn/nexus-template-internal): Develop a module with no GUI.

Nexus is built on [Electron](https://www.electronjs.org/) so modules must follow some of Electron's architectural rules — especially its [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model).

Your module will be split in two parts: The **process** and the **renderer**. 

- The process is the backend of your module. It can interact with the Node.js API, the filesystem, and external packages - but it **cannot interact with the DOM directly**.

- The renderer is the frontend of your module. It can manipulate the DOM and render your UI, but has **no direct access to the Node.js API**.

You will need to have the process and renderer work together to make a module. The API provided by Nexus makes this simple and easy to understand.

Utilizing [Inter-Process Communication](https://www.electronjs.org/docs/latest/tutorial/ipc), your process and renderer communicate through message-passing. This is already fully configured and all template repositories have these functions pre-written.


To communicate data from the process to renderer, it may look like this:  
> 1. The process wants to send arbitrary numbers to the renderer
> 2. Process invokes `this.sendToRenderer("number-event", 4, 5)`
> 3. Renderer catches the event in `handleEvent(eventType, data)`   
>       ↳ `eventType` = `"number-event"`   
>       ↳ `data` = `[4, 5]`   
> 4. Renderer displays the numbers in the UI. 

To communicate data from the renderer to the process:

> 1. A user clicks a button in the UI.
> 2. Renderer invokes  `sendToProcess("button-pressed", 1)`
> 3. Process handles this in `handleEvent(eventType, data)`   
>       ↳ `eventType` = `"button-pressed"`   
>       ↳ `data` = `[1]`   
> 4. Process can do something with the number. 


