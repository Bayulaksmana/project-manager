import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "./auth-context"

export const queryClient = new QueryClient()
const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
            <Toaster position="top-right" richColors />
        </QueryClientProvider>
    )
}

export default ReactQueryProvider