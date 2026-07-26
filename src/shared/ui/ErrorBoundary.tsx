/**
 * V2 ErrorBoundary — 捕获子组件渲染异常，展示 FailurePanel + 重试按钮。
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { FailurePanel } from './trust/FailurePanel'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <FailurePanel
            errorType="service_failure"
            message={this.state.errorMessage || '页面渲染异常，请重试。'}
            onRetry={this.handleRetry}
          />
        </div>
      )
    }
    return this.props.children
  }
}
