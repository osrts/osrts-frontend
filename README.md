# Open Source Race Timing System - Front-end

This repository contains the source code of the website (front-end) of our race timing system.

# Installation

To install the front-end on your machine, you first need to have Node.js installed.

## Dependencies

### Node.js
For installing Node.js, go to the [Node.js download page](https://nodejs.org/en/download/) and get the installer for your platform. Note that we use the LTS version which is the most stable (v6.11.0 when writing this documentation). Simply follow the instructions of the installer and it should be successfully installed.

To check if it is correctly installed, open a terminal window and launch the following command:

```
$ node -v
```
It should display the version of Node.js currently installed on your system.

## Cloning

Once Node.js is correctly installed

```
$ git clone https://github.com/osrts/osrts-frontend.git
$ cd osrts-frontend
$ npm install
```

The last command should install all the packages needed. If the installer of Semantic-UI shows up, skip the installation and let it use the suggested folder ("./semantic").

# Development server

For running the server in a development environment, use the `ng serve` command. Afterwards, navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If `ng` is not a recognized command, you might need to install the CLI of Angular globally. To do so, do the following command:

```
$ npm install -g @angular/cli
```

# Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

# Structure


- **config/** : contains the configuration files (development.json and production.json)
- **src/**
    - **hooks/** : contains the global hooks
    - **services/** : contains all the services and their hooks
    - **app.js** : initializes the application 
    - **index.js** : entry point of the application
- **test/**
    - **services/** : tests on all the services
    - **app.test.js** : entry point for all the tests

# Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

# License
[MIT](https://github.com/osrts/osrts-backend/blob/master/LICENSE)

# Authors

* Guillaume Deconinck
* Wojciech Grynczel