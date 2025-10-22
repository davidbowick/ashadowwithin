"use client";

import React from "react";

type Props = { children: React.ReactNode };

export default class ClientErrorBoundary extends React.Component<
  Props,
  { hasError: boolean; error?: any }
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Log the error and info to the console so we can inspect the stack in the browser
    console.error("ClientErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 8, background: "#fee", color: "#900" }}>
          <strong>Component failed to load.</strong>
          <div style={{ marginTop: 8 }}>Check the browser console for details.</div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
