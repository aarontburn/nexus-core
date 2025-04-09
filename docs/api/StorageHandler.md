# Nexus: `StorageHandler` API

## Overview
This class provides a simple API to access your modules storage.

This is easily replaceable with libraries like `fs`.



The location of the storage is defined as:
```typescript
const PATH: string = os.homedir() + (!process.argv.includes('--dev') ? "/.nexus/" : '/.nexus_dev/');
```

## Functions

### `writeToModuleStorage(module: Process, fileName: string, contents: string): Promise<void>`
> **Parameters**  
> `module: Process` → The module to access the storage to. From within your process, this is simply `this`  
> `fileName: string` → The name of the file to access.  
> `contents: string` → The contents to write.   
> **Returns**  
> A `Promise<void>` that resolves when the file finishes writing.

---


### `readFromModuleStorage(module: Process, fileName: string, encoding: string = 'utf-8')`
> **Parameters**  
> `module: Process` → The module to access the storage to. From within your process, this is simply `this`  
> `fileName: string` → The name of the file to access.  
> `contents: string` → The contents to write   
> **Returns**  
> A `Promise<string>` that resolves with the contents of the file, or `null` if the file couldn't be read.