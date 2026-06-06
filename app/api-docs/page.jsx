// app/api-docs/page.jsx
"use client";

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the parsed openapi specification schema dynamically
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Swagger specification definitions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500 animate-pulse">Loading API Documentation Schema...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-5xl mx-auto border shadow-sm rounded-xl overflow-hidden bg-gray-50">
        {spec ? <SwaggerUI spec={spec} /> : <p className="p-6 text-red-500">Failed to render documentation panel.</p>}
      </div>
    </div>
  );
}