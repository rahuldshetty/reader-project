# Developer Guide

### Building the Project

In order to build this project, you will need to have a package manager like npm or bun installed in your system.

1. Install packages: `bun i`
2. Build [side-car](https://github.com/rahuldshetty/reader-project/tree/master/sidecar-app) app 
3. Create `.env` file with following properties:
    ```
    # You can use one of the APIs from here: https://console.groq.com
    VITE_DEV_OPENAI_TOKEN=""
    ```
4. Start the project in developer mode by running: `bun run tauri dev`
5. Do your changes :)
6. Build the project: `bun run tauri build`
