# Nexus: Internal Module API

## Overview
Some of the internal modules expose an API that may be useful.

Each response is wrapped in a [`DataResponse`](./helpers/DataResponse.md) object.

## `nexus.Settings`
## `get-setting`
This endpoint can be used to get the value of any setting within the `General` tab (and not for other modules).

> **Parameters**  
> The name or access ID of the setting (name is usually easier if you don't know the access ID).  
> **Returns**  
> `400 BAD REQUEST` if the name/access ID is invalid (not a string or not found)  
> `200 OK` and the value of the setting



### `is-developer-mode`
This endpoint can be used to check if the `Developer Mode` setting has been turned on. 

**Note**: This is not the same as a development environment. This is mainly for production if you want to hide/expose things to developers and debuggers.

> **Parameters**  
> None  
> **Returns**  
> `200 OK` and the value of the `Developer Mode` setting in the `General` settings.

---

### `on-developer-mode-changed`
This endpoint can be used to subscribe to the `Developer Mode` setting. The `callback` parameter is also immediately called with the current value of the setting.

> **Parameters**  
> `callback: (isDev: boolean) => void` → A callback that is called whenever the `Developer Mode` setting is modified.    
> **Returns**  
> `200 OK` and undefined if the subscriber was set  
> `400 BAD REQUEST` and an `Error` object if the callback was a non-function. 

---

### `get-accent-color`
This endpoint can be used to subscribe to access the current value of the `Accent Color` setting.

> **Parameters**  
> None  
> **Returns**  
> `200 OK` and the value of the `Accent Color` setting.

## nexus.Main

### `get-module-IDs`
Returns an array of all installed module IDs.

> **Parameters**  
> None   
> **Returns**  
> `200 OK` and an array of all installed module IDs.

---

### `get-current-module-id`
Returns the id of the currently visible module ID.

> **Parameters**  
> None  
> **Returns**  
> `200 OK` and the ID of the currently visible module.

---

### `open-dev-tools`
Opens the web developer tools for the caller module.

Note: In development, this can be done with the keybind  `Shift+CommandOrControl+I`

> **Parameters**  
> `mode?: 'left' | 'right' | 'bottom' | 'detach'` → The orientation of the devtools. If omitted, the devtools will open on the right. If the mode is invalid, this will default to `right`.  
> **Returns**  
> `200 OK` and a success message  
> `404 NOT FOUND` if the source module is an internal module

---

### `reload`
Reloads the renderer of the caller module.

Note: In development, this can be done with the keybind `CommandOrControl+R`

> **Parameters**  
> `forceReload?: '--force'` → Force reloads the webpage, ignoring any cache.  
> **Returns**  
> `200 OK` and a success message.  
> `404 NOT FOUND` if the source module is an internal module.

---

### `swap-to-module`
Swaps the current visible module to the caller module.

> **Parameters**  
> None  
> **Returns**  
> `200 OK` and a success message.   
> `208 ALREADY REPORTED` if the caller module is already shown.   
> `404 NOT FOUND` if the source module is an internal module.

---