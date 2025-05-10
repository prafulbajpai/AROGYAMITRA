import { Heart } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container flex h-14 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="text-green-600 dark:text-green-400">Holistic Wellness</span> - Your path to natural health
        </p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-green-600 dark:hover:text-green-400">
            Privacy
          </Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-green-600 dark:hover:text-green-400">
            Terms
          </Link>
          <span className="text-xs text-muted-foreground flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by Wellness Team
          </span>
        </div>
      </div>
    </footer>
  )
}