"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { getApiServer } from "@/src/lib/api";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  scope?: "page" | "component";
  title?: string;
  description?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[FU-DEVER Landing ErrorBoundary caught error]:", error, errorInfo);

    if (typeof window !== "undefined") {
      try {
        const apiServer = getApiServer();
        const payload = JSON.stringify({
          message: error?.message || "Landing Page Component Crash",
          stack: error?.stack,
          componentStack: errorInfo?.componentStack,
          url: window.location.href,
        });

        const targetUrl = `${apiServer}/api/v1/telemetry/report-error`;
        if (navigator.sendBeacon) {
          navigator.sendBeacon(targetUrl, new Blob([payload], { type: "application/json" }));
        } else {
          fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }

  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  private handleReloadPage = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isComponentScope = this.props.scope === "component";

      if (isComponentScope) {
        return (
          <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {this.props.title || "Phần nội dung tạm thời bị gián đoạn"}
            </h4>
            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              {this.props.description || "Đã xảy ra lỗi khi hiển thị module này. Vui lòng bấm thử lại."}
            </p>
            <button
              onClick={this.handleReset}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Thử lại
            </button>
          </div>
        );
      }

      return (
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0066CC] shadow-inner ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900/50">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            {this.props.title || "Đã xảy ra sự cố không mong muốn"}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {this.props.description ||
              "Hệ thống đã tự động khoanh vùng lỗi để bảo vệ trải nghiệm của bạn. Bạn có thể làm mới trang hoặc chuyển về trang chủ CLB."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReloadPage}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Tải lại trang
            </button>

            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Home className="h-4 w-4" />
              Về Trang chủ
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
