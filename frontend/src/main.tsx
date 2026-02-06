import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ContextState from "./context/ContextState.tsx";

createRoot(document.getElementById("root")!).render(
	<ContextState>
		<App />
	</ContextState>
);
