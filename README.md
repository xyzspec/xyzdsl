# XYZ viewer

A standalone static **web** app and shared XYZDSL rendering package. No application server, transaction API, public keys, or account is required.
Direct XYZDSL input uses the configured remote GLB store by default.

## Run

```sh
npm install
npm run dev
```

Paste XYZDSL directly into the input, or use **Open scene folder** to select a
folder containing `scene.xyz` and its GLB files. Model paths are relative to
`scene.xyz`; nested folders are supported. Models remain in browser memory via
blob URLs, and are never uploaded. Local folder mode rejects remote model URLs; use **Use remote model store** to
switch back to remote assets. URL content renders as a text label.
Only one `scene.xyz` may be selected. Self-contained GLBs are supported; external
model dependencies are not resolved by the folder picker. Folder selection
requires a browser supporting directory file inputs (Chromium recommended).

`npm run build` generates `dist/`, including local Draco/Basis decoders. Serve
this directory on any static web host. `npm run preview` serves it locally.

## Shared core

`@xyz/viewer` exports `createSpatialDocument`, `SceneRoot`, and `AssetResolver`.
Source subpath exports expose the parser, spatial model, camera/navigation,
selection, and model resource lifecycle. Consumers need a TypeScript-aware
bundler. Wrap `SceneRoot` with `AssetResolver.Provider` to supply asset location
policy; remote storage belongs to the consumer. The standalone web app configures its
default store in `src/remoteAssets.ts`. React and Three must be shared
with the consuming application.

The sibling explorer uses `file:../xyz-viewer` and compatibility exports. Its
remote model base stays in `explorer/src/scene/remoteModelUrl.ts`; transaction
composition and fetching stay in explorer. Rendering tests live here; application
and remote semantics tests stay in explorer.

```sh
npm test
npm run build
```
