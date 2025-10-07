# Multiavatar Fill for Figma

Use this plugin to drop playful avatars onto the fills of any selected frame, rectangle, ellipse, or other fill-capable layer. Each avatar is generated on the fly with [`@multiavatar/multiavatar`](https://github.com/multiavatar/Multiavatar) using a timestamp-based seed so every run produces fresh artwork.

## Features

- Replace the top-most fill on the selected layer with a freshly generated Multiavatar SVG.
- When the layer has no fills, the plugin automatically inserts a new image fill.
- Works with frames, rectangles, ellipses, and any node that supports fills in the Figma Plugin API.

## Getting Started

1. **Install dependencies**
    ```bash
    npm install
    ```
2. **Run the watcher while you iterate**
    ```bash
    npm run watch
    ```
    The build step uses `@create-figma-plugin/build` (esbuild under the hood) to bundle `src/main.ts` together with the Multiavatar package into `build/code.js`.

## Installing in Figma

1. In the Figma desktop app, open any file and press `⌘/` (`Ctrl+/` on Windows).
2. Search for **Import plugin from manifest…**.
3. Choose the `manifest.json` generated in `build/` by the watch or build command.

Once imported, you can run the plugin from the Quick Actions menu like any other local plugin.

## Usage

1. Select one or more layers that support fills (frames, rectangles, ellipses, components, etc.).
2. Run **Multiavatar Fill** from the Quick Actions menu.
3. The plugin generates an SVG avatar using the current timestamp as a seed (and appends a counter when multiple layers are selected), converts it into an image fill, and replaces the layer’s first fill. If no fills exist, it adds the avatar as the only fill.

## Development Notes

- Core logic lives in `src/main.ts`. Adjust the seed generation or how fills are applied there.
- To produce a production bundle, run `npm run build`.
- Use the Figma console (`Show/Hide Console`) to debug `console.log` output.

## Acknowledgements

- [Multiavatar](https://github.com/multiavatar/Multiavatar) for the avatar generator.
- [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/) for the build tooling and plugin scaffolding.
