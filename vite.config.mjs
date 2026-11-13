import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {fileURLToPath} from "node:url";
const path=value=>fileURLToPath(new URL(value,import.meta.url));
export default defineConfig({root:path("./templates/"),base:"./",publicDir:path("./public/"),plugins:[react()],build:{outDir:path("./dist/"),emptyOutDir:true,rollupOptions:{input:{index:path("./templates/index.html"),privacy:path("./templates/privacy.html")}}}});
