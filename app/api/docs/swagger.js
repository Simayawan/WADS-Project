import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HAQ Student App API Documentation',
      version: '1.0.0',
      description: 'Complete API interactive schema for authentication, chat memory systems, and OCR text extraction workflows linked to Neon PostgreSQL.',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: process.env.NEXT_PUBLIC_APP_URL ? 'Production Server' : 'Local Development Server',
      },
    ],

    paths: {
      '/api/login': {
        post: {
          summary: 'Authenticate a student user session',
          description: 'Verifies credentials against the Neon User relation.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'student@haq.edu' },
                    password: { type: 'string', example: 'securePassword123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login successful.' },
            401: { description: 'Invalid email or password match.' },
            500: { description: 'Internal processing database connection failure.' }
          }
        }
      },
      '/api/chat': {
        post: {
          summary: 'Process homework chats via DeepSeek with continuous history tracking',
          description: 'Accepts a multi-turn history log array context and handles optional image OCR strings.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message', 'messagesHistory', 'userId'],
                  properties: {
                    message: { type: 'string', example: 'Solve this problem: 3x + 5 = 20' },
                    userId: { type: 'integer', example: 1 },
                    image: { type: 'string', description: 'Base64 image string (Optional)', example: 'data:image/png;base64,...' },
                    messagesHistory: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          role: { type: 'string', example: 'user' },
                          content: { type: 'string', example: 'Hello' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Streaming payload completed successfully.' },
            500: { description: 'Missing environmental variables or server exception.' }
          }
        }
      },
      '/api/features': {
        get: {
          summary: 'Retrieve available student portal feature flags',
          description: 'Returns activation modules for OCR tools and AI workspaces.',
          responses: {
            200: {
              description: 'Feature flags structural array fetched successfully.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ocrEnabled: { type: 'boolean', example: true },
                      chatHistoryEnabled: { type: 'boolean', example: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
 
  apis: [], 
};

export const spec = swaggerJSDoc(options);