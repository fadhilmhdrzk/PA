import { createRoot } from "react-dom/client";
import HelloWorld from "./HelloWorld";
import './custom.css';

createRoot(document.getElementById("root"))
    .render(
        <div>
            <HelloWorld/>
        </div>
    )