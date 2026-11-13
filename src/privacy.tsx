import {createRoot} from "react-dom/client";
import Privacy from "./privacy/page";
import {LanguageProvider} from "./I18n";
import "./globals.css";
import "./details.css";
createRoot(document.getElementById("root")!).render(<LanguageProvider><Privacy/></LanguageProvider>);
