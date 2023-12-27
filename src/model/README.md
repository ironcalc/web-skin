# Model

The TypeScript "Model" is a wrapper around the Rust (WebAssembly) engine that adds:

* History (Undo/Redo)
* Exposes a browser Typed API 
* Diffs (sends changes to server and applies changes from server)