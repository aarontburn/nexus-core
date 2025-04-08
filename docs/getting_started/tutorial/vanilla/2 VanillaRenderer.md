# Nexus: The Renderer

## Overview
Nexus is built on [Electron](https://www.electronjs.org/) so modules must follow some of Electron's architectural rules — especially its [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model).

Your module will be split in two parts: The **process** and the **renderer**. 

- The renderer is the frontend of your module. It can manipulate the DOM and render your UI, but has **no direct access to the Node.js API**.

You will need to have the process and renderer work together to make a module. The API provided by Nexus makes this simple and easy to understand.

Utilizing [Inter-Process Communication](https://www.electronjs.org/docs/latest/tutorial/ipc), your process and renderer communicate through message-passing. This communication system is already fully configured in the template — no setup required.

To communicate data from the renderer to the process:

> 1. A user clicks a button in the UI.
> 2. Renderer invokes  `sendToProcess("button-pressed", 1)`
> 3. Process handles this in `handleEvent(eventType, data)`   
>       ↳ `eventType` = `"button-pressed"`   
>       ↳ `data` = `[1]`   
> 4. Process can do something with the number. 

This section focuses specifically on the `renderer` side of things.

## Structure
```
root/
+-- src/
    +-- renderer/
        +-- assets/
            +-- ...

        +-- index.html
        +-- renderer.ts
        +-- styles.css
```
- `src/renderer/assets/`: This folder can be used to hold images, fonts, or any other assets your renderer may use.
- `src/renderer/index.html`: The default UI for your module.
- `src/renderer/renderer.ts`: The main logic file for the renderer. It listens for messages from the process and interacts with the DOM accordingly.
- `src/renderer/styles.css`: The styling for `index.html`.


## `renderer.ts`
This is where the logic of your renderer is stored. Not only does this file manipulate the DOM, it also is responsible for event handling between the process and itself.

```typescript
// src/renderer/renderer.ts

// Sends information to the process.
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.parent.ipc.send(window, eventType, data);
}

// Create event handler.
const handleEvent = (eventType: string, data: any[]) => {
    switch (eventType) {
        case 'sample-setting': {
            const html: HTMLElement = document.getElementById('counter-display');
            html.style.color = data[0] ? 'green' : 'red';
            html.innerText = data[0] ? 'on' : 'off'
            break;
        }
        default: {
            console.warn("Uncaught message: " + eventType + " | " + data)
            break;
        }
    }
}

// Attach event handler.
window.parent.ipc.on(window, (eventType: string, data: any[]) => {
    handleEvent(eventType, data);
});

// Instruct the module process to initialize once the renderer is ready.
sendToProcess("init");

// ...
```
These are the essential parts of the renderer that will allow it to communicate with your process.

#### Renderer to Process Communication
```typescript
// src/renderer/renderer.ts

// Sends information to the the process.
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.parent.ipc.send(window, eventType, data);
}
```
This provided function allows you to send information to the process, given an `eventType` and any data associated with the event.

For example:
```typescript
// src/renderer/renderer.ts
//...
let counter = 0;
// ...

const sendButton: HTMLElement = document.getElementById("send-button")
sendButton.addEventListener("click", () => sendToProcess("count", counter));
```
Here we attach an event listener to a button (created in `index.html`) to make it send the `count` back to the process. The `eventType` is `count`, and the `data` will be an array where the `data[0]` is the value of `counter` is at the time the button is pressed.

#### Process to Renderer Communication
```typescript
// src/renderer/renderer.ts
// ...

// Create event handler.
const handleEvent = (eventType: string, data: any[]) => {
    switch (eventType) {
        case 'sample-setting': {
            const html: HTMLElement = document.getElementById('counter-display');
            html.style.color = data[0] ? 'green' : 'red';
            html.innerText = data[0] ? 'on' : 'off'
            break;
        }
        default: {
            console.warn("Uncaught message: " + eventType + " | " + data)
            break;
        }
    }
}

// Attach event handler.
window.parent.ipc.on(window, (eventType: string, data: any[]) => {
    handleEvent(eventType, data);
});

// ...
```
The section of the renderer allows you to listen to events sent from the process. Anything the process sends will be captured within the `handleEvent` function.

#### Send `init` signal
```typescript
// src/renderer/renderer.ts
// ...

// Instruct the module process to initialize once the renderer is ready.
sendToProcess("init");

// ...
```
Here, we use the `sendToProcess` function to tell our process that the renderer is fully initialized and that the process should start its initialization cycle. Omitting this will result in your process never initializing properly.

## Shortcomings
Because Nexus renderers aren't bundled (like in typical Webpack or Vite setups), you can't use `import` or `require` directly in your renderer files. This is due to how the browser loads scripts in vanilla Electron, not a Node.js limitation.

If you need this, check out the [Nexus React Template](../react/ReactSetup.md).

However, just like in standard web development, you **can** create multiple renderer files.

```html
<!-- src/renderer/index.html -->
<!-- ... -->
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="script-src 'self';">

    <link rel="stylesheet" href="./styles.css">
    <script defer src="./renderer.js"></script>
    <!-- Add any additional renderer files here -->
</head>
<!-- ... -->
```
If you need access to process event handling from within your other renderer files, you can reuse the same `sendToProcess`, `handleEvent`, and `ipc.on` logic from above in your other renderer scripts.

## Next Steps
Learn about the various [CLI commands](./3%20VanillaCommands.md) you may use during development.
