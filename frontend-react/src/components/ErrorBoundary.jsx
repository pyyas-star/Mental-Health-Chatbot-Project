import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null
        });
        // Optionally reload the page
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        maxWidth: '500px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ 
                            fontSize: '28px', 
                            fontWeight: '700', 
                            color: '#1f2937',
                            marginBottom: '16px' 
                        }}>
                            Oops! Something went wrong
                        </h2>
                        <p style={{ 
                            fontSize: '16px', 
                            color: '#6b7280',
                            marginBottom: '24px',
                            lineHeight: '1.6'
                        }}>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </p>
                        
                        {this.state.error && (
                            <details style={{
                                background: '#f3f4f6',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                textAlign: 'left',
                                fontSize: '14px',
                                color: '#374151'
                            }}>
                                <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                                    Error Details
                                </summary>
                                <pre style={{ 
                                    whiteSpace: 'pre-wrap', 
                                    wordWrap: 'break-word',
                                    margin: '8px 0 0 0',
                                    fontSize: '12px'
                                }}>
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 32px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;



