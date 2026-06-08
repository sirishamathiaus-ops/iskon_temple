import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Must render inside BrowserRouter if using react-router <Link>.
 * Prefer plain <a href> in fallback to stay safe in all mount orders.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center">
          <p className="font-display text-2xl text-maroon-900">Something went wrong</p>
          <p className="mt-3 max-w-md text-sm text-maroon-800/85">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="btn-tap mt-6 rounded-full bg-maroon-900 px-6 py-3 text-sm font-semibold text-cream-50"
          >
            Try again
          </button>
          <a href="/" className="mt-4 text-sm font-semibold text-maroon-800 underline">
            Go to home
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
