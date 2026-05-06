import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

export class ErrorBoundary extends Component {
  /** @param {object} props */
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  /** @param {Error} error */
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Something broke' }
  }

  /** @param {Error} error */
  componentDidCatch(error, info) {
    console.error('ErrorBoundary', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold">Unexpected error</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {this.state.message}
            </p>
          </div>
          <Button type="button" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      )
    }
    return this.props.children ?? null
  }
}
