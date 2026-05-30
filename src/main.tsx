import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "@/App"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/components/theme/theme-provider"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
