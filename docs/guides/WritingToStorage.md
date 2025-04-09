# Nexus: Writing to Storage

## Overview
The Nexus API provides a way to access your modules storage using the `StorageHandler` class.

```typescript
export default SampleProcess extends Process {
    // ..

    private async readAndWriteToStorage() { // Sample function
        await StorageHandler.writeToModuleStorage(this, "config-file.txt", "sample contents");

        const contents = await StorageHandler.readFromModuleStorage(this, "config-file.txt");
        console.log(contents) // "sample contents"
    }
    //..
}
```

When your module is loaded into Nexus, a storage directory is automatically created for it in `C:\Users\<user home>\.nexus_dev\storage\<module ID>` (or `C:\Users\<user home>\.nexus\storage\<module ID>` in production.). 

Of course, you can use libraries like `fs` to store your files elsewhere.


## Best Practices
- Do not store sensitive information within the `nexus_dev\storage\` directory. While not directly, other installed modules can easy access these folders using libraries such as `fs`. Currently, there isn't a way to restrict access to these files from outside modules.
- Do not access the storages of other modules.