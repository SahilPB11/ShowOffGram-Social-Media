import { Routes, Route } from "react-router-dom"
import "./globals.css"
import SignInForm from "./_Auth/forms/SignInForm"
import SignUpForm from "./_Auth/forms/SignUpForm"
import AuthLayout from "./_Auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Home } from "./_root/pages/Index"
import { Toaster } from "@/components/ui/toaster"
const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                {/* public Routes */}
                <Route element={<AuthLayout />} >
                    <Route path="/sign-in" element={<SignInForm />} />
                    <Route path="/sign-up" element={<SignUpForm />} />
                </Route>

                {/* Private Routes */}
                <Route element={<RootLayout />} >
                    <Route index element={<Home />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}

export default App