# Nexus: Webpage Process

## Overview
### Read the [Process](../ProcessOverview.md) for details on how the process works.

The Process of a module that embeds a website is very similar to the Vanilla TS Template module or the Internal Template module.

There are two ways to embed a website.

### Method 1: `<webview>`
If you want to embed a website within an HTML file (e.g. to add an overlay), use a `<webview>` tag within your renderers `index.html`.  

```typescript
// src/process/main.ts

// ...
export default class SampleProcess extends Process {
    public constructor() {
        super({
            moduleID: MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                iconPath: ICON_PATH,
                htmlPath: path.join(__dirname, "../renderer/index.html"),
            }
        });
    }

    public async initialize(): Promise<void> {
        this.sendToRenderer("user-agent", {
            userAgent: session
                .fromPartition(`persist:${MODULE_ID}`)
                .getUserAgent()
                .replace(/Electron\/*/,''),
            partition: `persist:${MODULE_ID}`
        });
    }

    // This function is only needed if you have a renderer process via the webview tag

    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "init": {
                this.initialize();
                break;
            }
        }
    }
```
Because you still have a renderer process, you will need to listen to the `init` signal and act accordingly. In this case, we are sending the user-agent and partition to the renderer to correctly initialize the `<webview>`


### Method 2: `urlPath`
If you simply want to display a website without modifying it in any way, specify the `path.urlPath` within the constructor to the URL of the website.

Your constructor may look like this.
```typescript
// src/process/main.ts

// ...
export default class SampleProcess extends Process {
    public constructor() {
        super({
            moduleID: MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                iconPath: ICON_PATH,
                urlPath: "https://github.com/aarontburn/nexus-core/blob/main/docs/getting_started/Introduction.md#Nexus"
            },
            httpOptions: {
                userAgent: session
                    .fromPartition(`persist:${MODULE_ID}`)
                    .getUserAgent()
                    .replace(/Electron\/*/, ''),
                partition: `persist:${MODULE_ID}`
            }
        });
    }

    // ...
}
```
In this case, your process will function identically to an internal module. You won't have any access to the DOM.

You can safely delete the `/renderer/` folder and all its contents.



