# sidecar-app

```
# Install pkg globally (only once)
npm install -g @yao-pkg/pkg
npm install --save-exact --save-dev esbuild

# Build app executable
.\node_modules\.bin\esbuild index.js --bundle --outfile=out.js --platform=node
pkg --output app out.js

# Move the app executable under tauri's Rust bundles
node move-app-bundle.js
```


```
app.exe "parse" "https://www.reddit.com/r/IndianGaming/comments/1ijckyo/giveaway_for_any_game_of_your_choice_max_price/"
```
