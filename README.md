# Open Source Race Timing System - Front-end

This repository contains the source code of the website (front-end) of our race timing system.

# Installation

To install the front-end on your machine, you first need to have Node.js installed.

## Dependency

### Node.js
For installing Node.js, go to the [Node.js download page](https://nodejs.org/en/download/) and get the installer for your platform. Note that we use the LTS version which is the most stable (v6.11.0 when writing this documentation). Simply follow the instructions of the installer and it should be successfully installed.

To check if it is correctly installed, open a terminal window and launch the following command:

```
$ node -v
```
It should display the version of Node.js currently installed on your system.

## Cloning

Once Node.js is correctly installed, clone the repository and install the needed packages:

```
$ git clone https://github.com/osrts/osrts-frontend.git
$ cd osrts-frontend
$ npm install
```

If the installer of Semantic-UI shows up, skip the installation and let it use the suggested folder ("./semantic").

# Development server

For running the server in a development environment, use the `ng serve` command. 

```
$ ng serve
```

Afterwards, navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If `ng` is not a recognized command, you might need to install the CLI of Angular globally. To do so, execute the following command:

```
$ npm install -g @angular/cli
```

**Note that the back-end needs to be running as well in order for the data to be displayed !**

# Build

If you want to build the front-end (usually for production), type the following command
```
$ ng build
```
The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

# Structure

- **e2e/** : contains all the end-to-end tests.
- **src/**
    - **app/** : contains the source code of the front-end
        - **admin/** : contains the admin module and its related pages
        - **components/** : contains the re-usable components.
        - **services/** : contains the services used to interact with the back-end.
        - **Other folders** : contain the different pages of the App module.
        - **app.component.ts** : contains the main component of the application.
        - **app.module.ts** : is the main module of the application (and its entry point).
    - **assets/** : contains all the assets used by the front-end such as pictures.
    - **index.html** : the default html file.

# Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve` and that the back-end is running.

# License
[MIT](https://github.com/osrts/osrts-backend/blob/master/LICENSE)

# Authors

* Guillaume Deconinck
* Wojciech Grynczel