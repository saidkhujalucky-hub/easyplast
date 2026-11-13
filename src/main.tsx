import {createRoot} from "react-dom/client";
import EasyPlast from "./EasyPlast";
import {LanguageProvider} from "./I18n";
import "./globals.css";
import "./details.css";
import "./manufacturer.css";
import "./extras.css";
createRoot(document.getElementById("root")!).render(<LanguageProvider><EasyPlast user={null}/></LanguageProvider>);
