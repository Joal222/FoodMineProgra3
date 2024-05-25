import express, { Request, Response, NextFunction, Router } from 'express';
import dbConnect from '../configs/database.config';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import auth from '../middlewares/auth.mid';

interface CustomRequest extends Request {
    user?: { id: number };  // Asegúrate de que tu middleware de autenticación añade este campo
}

const router = Router();
router.use(auth);

router.post('/create', async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || req.user.id === undefined) {
            return res.status(401).send('User authentication failed');
        }

        const { items, name, address, addressLatLng, totalPrice } = req.body;

        if (items.length <= 0) {
            return res.status(HTTP_BAD_REQUEST).send('Cart is empty');
        }

        const result = await dbConnect`
            INSERT INTO orders (user_id, name, address, lat, lng, total_price, status)
            VALUES (${req.user.id}, ${name}, ${address}, ${addressLatLng.lat}, ${addressLatLng.lng}, ${totalPrice}, 'NEW')
            RETURNING id`;

        const orderId = result[0].id;

        for (const item of items) {
            await dbConnect`
                INSERT INTO order_items (order_id, food_id, price, quantity)
                VALUES (${orderId}, ${item.food.id}, ${item.price}, ${item.quantity})`;
        }

        res.send({ orderId: orderId });
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).send('Error creating order');
    }
});

router.get('/newOrderForCurrentUser', async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || req.user.id === undefined) {
            return res.status(401).send('User authentication failed');
        }

        const order = await dbConnect`
            SELECT * FROM orders WHERE user_id = ${req.user.id} AND status = 'NEW' ORDER BY created_at DESC LIMIT 1`;

        if (!order[0]) {
            return res.status(404).send('No new order found');
        }

        res.send(order[0]);
    } catch (error) {
        console.error('Failed to retrieve order:', error);
        res.status(500).send('Error retrieving order');
    }
});

// Asegúrate de definir y exportar adecuadamente cualquier otro endpoint que necesites

export default router;
