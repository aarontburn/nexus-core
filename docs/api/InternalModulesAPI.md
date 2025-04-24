# Nexus: Internal Module API

## Overview
Some of the internal modules expose an API that may be useful.

Each response is wrapped in a [`DataResponse`](./helpers/DataResponse.md) object.

## `nexus.Settings`
### `is-developer-mode`
This endpoint can be used to check if the `Developer Mode` setting has been turned on. 

**Note**: This is not the same as a development environment. This is mainly for production if you want to hide/expose things to developers and debuggers.

> **Parameters**  
> None  
> **Returns**  
> The value of the `Developer Mode` setting in the `General` settings wrapped in a `DataResponse` object. 

---

### `on-developer-mode-changed`
This endpoint can be used to subscribe to the `Developer Mode` setting. The `callback` parameter is also immediately called with the current value of the setting.

> **Parameters**  
> `callback: (isDev: boolean) => void` → A callback that is called whenever the `Developer Mode` setting is modified.    
> **Returns**  
> Undefined and HTTP Code 200 (OK) if the subscriber was set, or an `Error` object and HTTP Code 400 (Bad Request) if the callback was a non-function. 

---

### `get-accent-color`
This endpoint can be used to subscribe to access the current value of the `Accent Color` setting.

> **Parameters**  
> None  
> **Returns**  
> The value of the `Accent Color` setting wrapped in a `DataResponse` object.

## nexus.Main

### `get-module-IDs`
Returns an array of all installed module IDs.

> **Parameters**  
> None   
> **Returns**  
> An array of all installed module IDs (along with HTTP Code 200).

---

### `get-current-module-id`
Returns the id of the currently visible module ID.

> **Parameters**  
> None  
> **Returns**  
> The ID of the currently visible module (along with HTTP Code 200).

---

### `open-dev-tools`
Opens the web developer tools for the caller module.

Note: In development, this can be done with the keybind  `Shift+CommandOrControl+I`

> **Parameters**  
> `mode?: 'left' | 'right' | 'bottom' | 'detach'` → The orientation of the devtools. If omitted, the devtools will open on the right. If the mode is invalid, this will default to `right`.  
> **Returns**  
> A success message (along with HTTP Code 200) if this was successful. If the source module is an internal module, this will return HTTP Code 404 (not found) instead.

---

### `reload`
Reloads the renderer of the caller module.

Note: In development, this can be done with the keybind `CommandOrControl+R`

> **Parameters**  
> `forceReload?: '--force'` → Force reloads the webpage, ignoring any cache.  
> **Returns**  
> A success message (along with HTTP Code 200) if this was successful. If the source module is an internal module, this will return HTTP Code 404 (not found) instead.

---

### `swap-to-module`
Swaps the current visible module to the caller module.

> **Parameters**  
> None  
> **Returns**  
> A success message (along with HTTP Code 200) if this was successful. If the caller module is already shown, this will return HTTP Code 208 (already reported). If the source module is an internal module, this will return HTTP Code 404 (not found) instead.

---