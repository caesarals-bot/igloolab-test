import { Loader2 } from "lucide-react"

interface PageLoaderProps {
    message?: string
    fullScreen?: boolean
}

export function PageLoader({ message = "Cargando...", fullScreen = true }: PageLoaderProps) {
    const containerClass = fullScreen
        ? "min-h-screen flex items-center justify-center bg-background"
        : "min-h-[400px] flex items-center justify-center"

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-lg text-muted-foreground animate-pulse">{message}</p>
            </div>
        </div>
    )
}

export function ComponentLoader() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    )
}
