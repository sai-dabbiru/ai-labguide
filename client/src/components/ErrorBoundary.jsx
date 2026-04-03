import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#222', color: '#ff8a80', height: '100vh', width: '100vw', boxSizing: 'border-box', overflow: 'auto' }}>
          <h2 style={{ color: '#ff5252', marginBottom: '16px' }}>App Render Error</h2>
          <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>
            {this.state.error && this.state.error.toString()}
          </div>
          <details style={{ whiteSpace: 'pre-wrap', background: '#111', padding: '16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.5' }} open>
            <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 'bold', color: '#ffaa00' }}>Component Stack Trace</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
