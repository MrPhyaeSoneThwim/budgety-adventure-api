const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Budgety Adventure API",
      version: "1.0.0",
      description:
        "REST API for personal finance and budget tracking. Handles multi-wallet management, income/expense transactions, category analytics, and OTP-based user authentication.",
      contact: {
        name: "Phyae Sone Thwim",
        email: "mr.phyaesonethwim1998@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter the JWT token obtained from /api/users/login or /api/users/verify-otp",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
            name: { type: "string", example: "John Doe" },
            bio: { type: "string", example: "Personal finance enthusiast" },
            email: { type: "string", format: "email", example: "john@example.com" },
            avatar: { type: "string", example: "avatar-1234567890.jpeg" },
            active: { type: "boolean", example: true },
          },
        },
        Wallet: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e2" },
            name: { type: "string", example: "Main Wallet" },
            icon: { type: "string", example: "wallet-one" },
            iconColor: { type: "string", example: "#ef4444" },
            balance: { type: "number", example: 1500.0 },
            user: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e3" },
            name: { type: "string", example: "Food & Drink" },
            type: { type: "string", enum: ["income", "expense"], example: "expense" },
            icon: { type: "string", example: "food" },
            iconColor: { type: "string", example: "#f59e0b" },
            createdAt: { type: "string", format: "date-time" },
            user: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e4" },
            amount: { type: "number", example: 250.0 },
            status: { type: "string", enum: ["income", "expense"], example: "expense" },
            createdAt: { type: "string", format: "date", example: "2024-01-15" },
            user: { type: "string", example: "64a1b2c3d4e5f6a7b8c9d0e1" },
            wallet: { $ref: "#/components/schemas/Wallet" },
            category: { $ref: "#/components/schemas/Category" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/*.js"],
};

module.exports = swaggerJsdoc(options);
