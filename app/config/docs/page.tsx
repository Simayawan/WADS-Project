/**
 * WEEK 10: API Documentation Infrastructure
 * This file uses dynamic importing to prevent SSR (Server-Side Rendering) issues 
 * with Swagger-UI in a Next.js environment.
 */

"use client";

// @ts-ignore - Bypasses missing type definitions for the Swagger library
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to ensure it only loads on the client side
const SwaggerUI: any = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p className="p-10 text-center text-gray-500 animate-pulse">
        Loading API Documentation...
      </p> 
    </div>
  )
});

export default function ApiDocs() {
  // OpenAPI 3.0.0 Specification
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Homework Assistant API",
      version: "1.0.0",
      description: "Documentation for the Homework Assistant endpoints (Week 10 Checkpoint)",
    },
    paths: {
      "/api/features": {
        get: { 
          summary: "Get all features", 
          description: "Returns a list of all current app features from the MongoDB database.",
          responses: { 
            200: { 
              description: "A successful list of features",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" }
                      }
                    }
                  }
                }
              }
            } 
          } 
        },
      },
      "/api/auth/login": {
        post: {
          summary: "User Login",
          description: "Authenticates user and returns a security token via cookies.",
          responses: {
            200: { description: "Login successful" },
            401: { description: "Unauthorized - Security check failed" }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Containerized Swagger UI component */}
      <SwaggerUI spec={spec} />
    </div>
  );
}