/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management and analytics. All endpoints require authentication.
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Returns transactions for the authenticated user. Supports filtering by status and date. Transactions are auto-populated with their category and wallet documents.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         description: Filter by exact date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No transactions found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [wallet, category, amount, status]
 *             properties:
 *               wallet:
 *                 type: string
 *                 description: Wallet ObjectId
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e2
 *               category:
 *                 type: string
 *                 description: Category ObjectId
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e3
 *               amount:
 *                 type: number
 *                 example: 250
 *               status:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               createdAt:
 *                 type: string
 *                 format: date
 *                 description: Transaction date (defaults to today if omitted)
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Transaction has been created.
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e4
 *     responses:
 *       200:
 *         description: Transaction data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wallet:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e2
 *               category:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e3
 *               amount:
 *                 type: number
 *                 example: 300
 *               status:
 *                 type: string
 *                 enum: [income, expense]
 *               createdAt:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *     responses:
 *       200:
 *         description: Transaction updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Transaction has been successfully updated.
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e4
 *     responses:
 *       200:
 *         description: Transaction deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Transaction has been deleted.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/transactions/monthly-stats/year/{year}/month/{month}:
 *   get:
 *     summary: Monthly income/expense summary
 *     description: Uses a MongoDB aggregation pipeline to compute total income and expense for a given month, including percentage rates and net difference.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2024
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 1
 *     responses:
 *       200:
 *         description: Monthly stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         income:
 *                           type: number
 *                           example: 3000
 *                         expense:
 *                           type: number
 *                           example: 1200
 *                         incomeRate:
 *                           type: number
 *                           description: Income as % of total (rounded to 2dp)
 *                           example: 71.43
 *                         expenseRate:
 *                           type: number
 *                           description: Expense as % of total (rounded to 2dp)
 *                           example: 28.57
 *                         difference:
 *                           type: number
 *                           description: income - expense
 *                           example: 1800
 *       400:
 *         description: Missing year or month
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No transactions found for the period
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/transactions/annual-stats/year/{year}:
 *   get:
 *     summary: Annual income/expense stats grouped by month
 *     description: Uses a MongoDB aggregation pipeline to return income and expense totals for each month of the given year. Months with no transactions are included with zero values.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2024
 *     responses:
 *       200:
 *         description: 12-month stats array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             description: Month number (1–12)
 *                             example: 1
 *                           monthName:
 *                             type: string
 *                             example: January
 *                           income:
 *                             type: number
 *                             example: 3000
 *                           expense:
 *                             type: number
 *                             example: 1200
 *       400:
 *         description: Missing year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No transactions found for the year
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/wallets/{walletId}/transactions:
 *   get:
 *     summary: Get transactions for a specific wallet
 *     description: Filters transactions by wallet ID. Supports the same query parameters as GET /api/transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Wallet transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
