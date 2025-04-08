# Nexus

## What is Nexus?
Nexus is an application environment and loader. Developers can create applications, or **modules**, that can be loaded into the Nexus environment, keeping everything in one place. 

Think of Nexus as a customizable toolbox — one app that can do anything that you (or the community) build into it.

## What is a module?

A **module** can be anything you can create in Node.js. From anything from a [system volume controller](https://github.com/aarontburn/nexus-volume-controller) to an [internal debug console](https://github.com/aarontburn/nexus-debug-console), there are no limits to what you can create. 


The benefit of developing with Nexus is that any module you install can be loaded into a single application, reducing window clutter, and Nexus provides an extensive framework to allow for module interconnectivity and ease-of-development.


**Application Lifecycle Handling**: Built-in and easily-modifiable functions are called during different parts of the application lifecycle, such as when your module is opened, closed, and initialized.

**User Configuration Settings**: Nexus provides a simple way to create and handle settings that your module may want the user to configure. Simply provide the settings you want to expose, and Nexus will create the UI, event handling, and do the storage reading/writing for you.

**Storage Handling**: Built-in classes and methods make it easy to read/write from storage.

**Module Communication**: Modules have the ability to communicate with each other and expose an API that other modules can access, which allows for interconnectivity and extensibility.

**Export and Distribution**: Nexus comes pre-configured to export your module into an archive file for easy distribution without much (or any) configuration.

## Installing Nexus

## Developing for Nexus
To begin developing a module for Nexus, visit [Building Your First Module](./tutorial/BuildingYourFirstModule.md).