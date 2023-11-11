import { createRoot } from "react-dom/client"; // import the createRoot named export
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthConext.tsx";
import QueryProvider from "./lib/react-query/QueryProvider";

createRoot(document.getElementById('root')!).render( // use the createRoot function
    <BrowserRouter>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
    </BrowserRouter>
)
