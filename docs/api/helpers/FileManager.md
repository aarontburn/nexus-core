# Nexus: File Manager
## Overview
This class manages file IO for your module. 

### `[async] readFromStorage(fileName: string, encoding: BufferEncoding = 'utf-8'): Promise<string | null>`
Read a file from the root directory of the module's storage.

> **Parameters**  
> `fileName: string` → The file name to read, including the extension.  
> `encoding: BufferEncoding` → The encoding to read the file with. Defaults to `utf-8`.  
> **Returns**  
> A `Promise` that resolves to the string contents, or `null` if the file wasn't found.  
> **Throws**  
> The error that occurs while reading that isn't `ENOENT` (no such file or directory). 

---

### `[async] writeToStorage(fileName: string, contents: string, encoding: BufferEncoding = 'utf-8'): Promise<void>`
Writes a file to the root of the module's storage.

> **Parameters**  
> `fileName: string` → The file name to read, including the extension.
> `contents: string` → The contents to write in the file.  
> `encoding: BufferEncoding` → The encoding to read the file with. Defaults to `utf-8`.  
> **Returns**  
> A `Promise` that resolves when the file is written. 

---

### `[async] writeSettingsToStorage(): Promise<void>`
Writes the settings to storage. This should be called after manually setting a settings' value.

> **Returns**  
> A `Promise` that resolves when the settings are written.