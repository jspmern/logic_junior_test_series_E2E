const express=require('express');
const router=express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Health:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "UP"
 */
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 *             example:
 *               status: "UP"
 */
router.get("/health", (req, res) => {
    res.json({ status: "UP" });
});
module.exports=router;
