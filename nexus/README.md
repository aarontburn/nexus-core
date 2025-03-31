
# Modules
Author: [aarontburn](https://github.com/aarontburn) 

## What is Modules?
**Modules** is a platform designed to simplify the creation, sharing, and installation of Node.js sub-applications, called a *module*. A *module* can be anything; a system volume controller, calendar, alarm; anything that can be created using TypeScript and Node.js, which mean it can quite literally be anything.

![image](https://github.com/aarontburn/modules/assets/103211131/9c37290c-1368-451f-a272-98ff778165c2)

Doesn't seem like much on its own, right? Let's add a module...
![image](https://github.com/aarontburn/modules/assets/103211131/0c56c4ca-6305-43cd-b30e-d913d2dbf982)
## Developer Features:
- Full Node.js support
- Full dependency support (able to use NPM packages for modules)
  - If your module has a dependency, it will automatically be bundled with your module as you export it. Simply make sure it is listed in `package.json`.
 - Simple, yet effective, API
   - Pre-defined functions and objects are designed to streamline the creation of your module, including:
	   - Pre-built option UIs 
	   - Defined application lifecycle functions (`onExit()`, `onGUIShown()`, `onGUIHidden()`)
 - Inter-Module Communication
   - Modules are able to send/receive data from each other.  
 

## Example: [Volume Controller Module](https://github.com/aarontburn/modules-volume_controller) 
![image](https://github.com/aarontburn/modules/assets/103211131/a1311957-7fce-47ea-a449-7370aa381645)

This module is a substitute for the Windows Audio Mixer and includes additional functions. While simple, this module is meant to serve as a demonstration of how this platform could be used.

## Developing a Module:
Visit the **modules-module-quickstart** GitHub repository to develop a module.  
[modules quickstart template](https://github.com/aarontburn/modules-module-quickstart)

## Additional Screenshots:
The settings for the built-in *Home* module.
![image](https://github.com/aarontburn/modules/assets/103211131/9f678c8f-88ba-4c32-894f-6bab67b4700e)

