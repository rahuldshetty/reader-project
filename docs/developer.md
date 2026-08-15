# Developer Guide

### Building the Project

In order to build this project, you will need to have a package manager like npm or bun installed in your system.

1. Install packages: `bun i`
2. Create `.env` file with following properties:
    ```
    # You can use one of the APIs from here: https://console.groq.com
    VITE_DEV_OPENAI_TOKEN=""
    ```
3. Start the project in developer mode by running: `bun run tauri dev`
4. Do your changes :)
5. Build the project: `bun run tauri build`
