"use client";

import { AlertCircle, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ApiErrorDisplayProps {
  title: string;
  error: unknown;
  endpoint?: string;
  payload?: unknown;
  response?: unknown;
}

export default function ApiErrorDisplay({
  title,
  error,
  endpoint,
  payload,
  response,
}: ApiErrorDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error);

  const errorStack =
    error instanceof Error && error.stack ? error.stack : null;

  if (!isExpanded) {
    return (
      <div className="mb-4 rounded-lg border-2 border-red-300 bg-red-50 p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800">{title}</h3>
            <p className="line-clamp-2 text-sm text-red-700">{errorMessage}</p>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-red-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border-2 border-red-300 bg-red-50 p-4">
      <button
        onClick={() => setIsExpanded(false)}
        className="mb-3 flex w-full items-center gap-3"
      >
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-red-800">{title}</h3>
        </div>
        <ChevronUp className="h-4 w-4 flex-shrink-0 text-red-600" />
      </button>

      <div className="space-y-3 border-t border-red-200 pt-3">
        {/* Error Message */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-red-800">Error Message</h4>
            <button
              onClick={() => copyToClipboard(errorMessage, "message")}
              className="rounded px-2 py-1 text-xs hover:bg-red-100"
            >
              <Copy className="h-3 w-3" />
              {copiedSection === "message" && <span className="ml-1">Copied!</span>}
            </button>
          </div>
          <pre className="overflow-x-auto rounded bg-red-100 p-2 text-xs text-red-900">
            {errorMessage}
          </pre>
        </div>

        {/* Error Stack */}
        {errorStack && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-red-800">Stack Trace</h4>
              <button
                onClick={() => copyToClipboard(errorStack, "stack")}
                className="rounded px-2 py-1 text-xs hover:bg-red-100"
              >
                <Copy className="h-3 w-3" />
                {copiedSection === "stack" && <span className="ml-1">Copied!</span>}
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-red-100 p-2 text-xs text-red-900 max-h-40">
              {errorStack}
            </pre>
          </div>
        )}

        {/* Endpoint */}
        {endpoint && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-red-800">Endpoint</h4>
            <pre className="overflow-x-auto rounded bg-red-100 p-2 text-xs text-red-900">
              {endpoint}
            </pre>
          </div>
        )}

        {/* Request Payload */}
        {payload && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-red-800">Request Payload</h4>
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(payload, null, 2), "payload")
                }
                className="rounded px-2 py-1 text-xs hover:bg-red-100"
              >
                <Copy className="h-3 w-3" />
                {copiedSection === "payload" && <span className="ml-1">Copied!</span>}
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-red-100 p-2 text-xs text-red-900 max-h-40">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {/* Response Body */}
        {response && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-red-800">
                Response Body
              </h4>
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(response, null, 2), "response")
                }
                className="rounded px-2 py-1 text-xs hover:bg-red-100"
              >
                <Copy className="h-3 w-3" />
                {copiedSection === "response" && (
                  <span className="ml-1">Copied!</span>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded bg-red-100 p-2 text-xs text-red-900 max-h-40">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Development Mode Notice */}
        <div className="rounded bg-yellow-100 p-2 text-xs text-yellow-800">
          💡 This error display is only visible in development. It will be
          removed in production.
        </div>
      </div>
    </div>
  );
}
