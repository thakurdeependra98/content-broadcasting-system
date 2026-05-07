import { MoonStar, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { useTheme } from '@/hooks/useTheme.js'

export function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunMedium className="h-4 w-4" aria-hidden /> : <MoonStar className="h-4 w-4" aria-hidden />}
      <span className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
    </Button>
  )
}