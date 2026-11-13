import {build} from "vite";
import {fileURLToPath} from "node:url";
import {cp,rm} from "node:fs/promises";
await build({configFile:fileURLToPath(new URL("./vite.config.mjs",import.meta.url))});
for(const name of ["assets","images","index.html","privacy.html","config.js","favicon.svg",".nojekyll"]){
 await rm(new URL(name,import.meta.url),{recursive:true,force:true});
 await cp(new URL("./dist/"+name,import.meta.url),new URL("./"+name,import.meta.url),{recursive:true});
}
