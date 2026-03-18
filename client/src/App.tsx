12:44:31.947 Running build in Portland, USA (West) – pdx1
12:44:31.948 Build machine configuration: 2 cores, 8 GB
12:44:32.086 Cloning github.com/orsonhayes93-cloud/airdrop-app (Branch: main, Commit: 4acf0e2)
12:44:35.161 Cloning completed: 3.075s
12:44:35.265 Restored build cache from previous deployment (3RAAvweZJbfjDkd5e9EHcYpuGtjz)
12:44:35.566 Running "vercel build"
12:44:36.164 Vercel CLI 50.32.4
12:44:36.780 Installing dependencies...
12:44:38.061 
12:44:38.063 up to date in 1s
12:44:38.063 
12:44:38.064 68 packages are looking for funding
12:44:38.064   run `npm fund` for details
12:44:38.095 Running "npm run build"
12:44:38.190 
12:44:38.190 > rest-express@1.0.0 build
12:44:38.190 > vite build
12:44:38.190 
12:44:38.644 [36mvite v7.1.12 [32mbuilding for production...[36m[39m
12:44:38.742 transforming...
12:44:39.132 [32m✓[39m 11 modules transformed.
12:44:39.134 [31m✗[39m Build failed in 451ms
12:44:39.134 [31merror during build:
12:44:39.135 [31mCould not resolve "./HubPage" from "client/src/App.tsx"[31m
12:44:39.135 file: [36m/vercel/path0/client/src/App.tsx[31m
12:44:39.135     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
12:44:39.135     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
12:44:39.135     at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21565:24)
12:44:39.135     at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21525:26[39m
12:44:39.159 Error: Command "npm run build" exited with 1

// ... other imports

<Routes>
  <Route path="/swap" component={SwapPage} />
  <Route path="/stake" component={StakePage} />
  <Route path="/airdrop" component={AirdropPage} />
  <Route path="/hub/:id" component={HubPage} />
  <Route component={NotFound} />
</Routes>
