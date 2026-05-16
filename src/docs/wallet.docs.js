/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management. All endpoints require authentication.
 */

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Get all wallets
 *     description: Returns all wallets belonging to the authenticated user. Each wallet's balance is recalculated live from its transaction history.
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets with live balances
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
 *                     wallets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No wallets found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, icon, iconColor, balance]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Savings
 *               icon:
 *                 type: string
 *                 example: piggy-bank
 *               iconColor:
 *                 type: string
 *                 example: "#10b981"
 *               balance:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Wallet created
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
 *                   example: Wallet has been created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     wallet:
 *                       $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/wallets/{id}:
 *   get:
 *     summary: Get a wallet by ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ObjectId
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       200:
 *         description: Wallet data
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
 *                     wallet:
 *                       $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update a wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Emergency Fund
 *               icon:
 *                 type: string
 *                 example: shield
 *               iconColor:
 *                 type: string
 *                 example: "#6366f1"
 *               balance:
 *                 type: number
 *                 example: 3000
 *     responses:
 *       200:
 *         description: Wallet updated with live recalculated balance
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
 *                   example: Wallet has been updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     wallet:
 *                       $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a wallet
 *     description: Deletes the wallet and cascades deletion to all associated transactions.
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *     responses:
 *       200:
 *         description: Wallet deleted
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
 *                   example: Wallet has been deleted.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/wallets/get-stats/{walletId}/type/{type}:
 *   get:
 *     summary: Get wallet statistics
 *     description: |
 *       Returns income/expense totals, rates, difference, and remaining balance for a wallet.
 *       - `type=stats` — includes full transaction list alongside the stats
 *       - `type=detail` — returns stats only (no transaction list)
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e2
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stats, detail]
 *         example: stats
 *     responses:
 *       200:
 *         description: Wallet statistics
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
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         icon:
 *                           type: string
 *                         iconColor:
 *                           type: string
 *                         balance:
 *                           type: number
 *                           description: Initial wallet balance
 *                         income:
 *                           type: number
 *                           description: Total income amount
 *                         expense:
 *                           type: number
 *                           description: Total expense amount
 *                         incomeRate:
 *                           type: number
 *                           description: Income as percentage of total (rounded to 2dp)
 *                         expenseRate:
 *                           type: number
 *                           description: Expense as percentage of total (rounded to 2dp)
 *                         difference:
 *                           type: number
 *                           description: income - expense
 *                         remain:
 *                           type: number
 *                           description: balance + difference
 *                     transactions:
 *                       type: array
 *                       description: Only present when type=stats
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid type parameter
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
 *         description: Wallet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
