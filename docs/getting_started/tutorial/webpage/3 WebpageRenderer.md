# Nexus: Webpage Renderer

## Overview
If your webpage uses the `urlPath` in the constructor, your module will not have a renderer process and this section can be skipped.



Your module will be using a `<webview>` tag to embed the website. Unlike the `<iframe>`, you can embed most sites without worry about getting blocked from the sites X-Frame-Options.

The `<webview>` will live within `index.html` and should be initialized from the `renderer.ts` file, using the user agent and partition sent from the process.


For more details on how the renderer works, visit the [Vanilla TS Module Template](../vanilla/2%20VanillaRenderer.md).


```typescript
// Sends information to the the process.
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.ipc.send(window, eventType, data);
}

const url: string = "https://github.com/aarontburn/nexus-core/blob/main/docs/getting_started/Introduction.md#Nexus";

// Handle events from the process.
const handleEvent = (eventType: string, data: any[]) => {
    switch (eventType) {
        case "user-agent": {
            // Create the webview
            const { userAgent, partition } = data[0];

            const html: string = `
                <webview 
                    allowpopups 
                    src="${url}"
                    partition="${partition}" 
                    userAgent="${userAgent}"
                ></webview>
            `
            document.getElementById("app").insertAdjacentHTML('beforeend', html);
            break;
        }
        default: {
            console.warn(`Uncaught message: ${eventType} | ${data}`);
            break;
        }
    }
}

// Attach event handler.
window.ipc.on(window, (eventType: string, data: any[]) => {
    handleEvent(eventType, data);
});


// Instruct the module process to initialize once the renderer is ready.
sendToProcess("init");
```



## Next Steps:
Learn about the various [CLI commands](./4%20WebpageCommands.md) you may use during development.
