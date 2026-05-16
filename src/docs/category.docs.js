/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and analytics. All endpoints require authentication.
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Returns categories for the authenticated user. Filter by type using the query parameter.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, all]
 *         description: Filter by category type. Omit or pass "all" to return all categories.
 *         example: expense
 *     responses:
 *       200:
 *         description: List of categories sorted by type then creation date
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, icon, iconColor]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               icon:
 *                 type: string
 *                 example: shopping-cart
 *               iconColor:
 *                 type: string
 *                 example: "#f59e0b"
 *     responses:
 *       201:
 *         description: Category created
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
 *                   example: Category has been created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Returns the category along with the total amount of all transactions linked to it.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e3
 *     responses:
 *       200:
 *         description: Category with total transaction amount
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
 *                     category:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Category'
 *                         - type: object
 *                           properties:
 *                             amount:
 *                               type: number
 *                               description: Sum of all transaction amounts for this category
 *                               example: 1450
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food & Dining
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               icon:
 *                 type: string
 *                 example: utensils
 *               iconColor:
 *                 type: string
 *                 example: "#ef4444"
 *     responses:
 *       200:
 *         description: Category updated
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
 *                   example: Category has been updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a category
 *     description: Deletes the category and cascades deletion to all associated transactions.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e3
 *     responses:
 *       200:
 *         description: Category deleted
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
 *                   example: Category has been deleted successfully.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/categories/stats/year/{year}/month/{month}/type/{type}:
 *   get:
 *     summary: Monthly category breakdown by type
 *     description: |
 *       Uses a MongoDB aggregation pipeline to return per-category spending/earning totals for a given month, including each category's percentage of the total.
 *       When there are more than 3 categories, results are grouped into top categories + an "Others" bucket.
 *     tags: [Categories]
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
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         example: expense
 *     responses:
 *       200:
 *         description: Category stats for the period
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
 *                     statsList:
 *                       type: array
 *                       description: Full breakdown — one entry per category
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           iconColor:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           total:
 *                             type: number
 *                             description: Grand total for the period
 *                           percent:
 *                             type: number
 *                             description: This category's share of total (rounded to 2dp)
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           description: Grand total for the period
 *                           example: 2500
 *                         categoryStats:
 *                           type: array
 *                           description: Top categories + "Others" bucket if more than 3 categories
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               amount:
 *                                 type: number
 *                               percent:
 *                                 type: number
 *                               iconColor:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Missing params or no data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
