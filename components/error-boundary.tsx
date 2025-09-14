"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md flex flex-col items-center justify-center text-center gap-2">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">Something went wrong</h2>
          <p className="text-sm text-red-600 dark:text-red-400 max-w-md">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            variant="outline" 
            className="mt-2 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
