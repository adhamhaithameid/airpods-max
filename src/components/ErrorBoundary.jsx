import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          className="error-fallback"
          style={{
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: "8px",
            color: "white",
            textAlign: "center",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <h3>Something went wrong loading the 3D model</h3>
          <p>We're displaying a placeholder instead</p>
          <div
            className={`airpods-placeholder bg-${
              this.props.fallbackColor || "space-gray"
            }`}
            style={{ width: "200px", height: "200px", margin: "20px auto" }}
          ></div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
