<p align="center">
  <img src="https://github.com/user-attachments/assets/6f71f498-bd4b-4876-ab8e-e9dca890d8ba" />
</p>

# Impart

An open-source, no AI, fully offline gallery organization tool (currently Windows and Linux only)!

- Tag your art however you want, with as many tags as you want
- Organize files into stacks (and tag those too!)
- Images and source files are automatically bundled (by filename) so you can get straight to the art
- and much more!

![impartDemo](https://github.com/user-attachments/assets/b0023f2e-051b-4a33-9b32-130b9d32360a)

Check out the [latest release](https://github.com/Arastryx/impart/releases/latest) to get started!

**NOTE:** The app is currently unsigned, so Windows will definitely show you a warning that the app is unsafe. In the future, I may look into getting the app properly certified.

## Contributing

Impart is built on electron-vite using typescript react. As such, it can also be deployed on MacOS, but at this point, it's completely untested.

### Requirements

- Node v22.19.0 or greater **including Tools for Native Modules**
  - If you have node but haven't installed native tools, you can refer to [this guide here](https://github.com/nodejs/node-gyp#on-windows) on how to set them up

### Running the app

1. Run `npm install`
2. Run `npm run dev`
3. (Optional) In separate terminals, run `npm run typewatch:web` and `npm run typewatch:node` for typescript error checking

_Better readme pending!_

