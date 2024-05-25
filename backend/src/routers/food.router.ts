import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
const router = Router();
import dbConnect from "../configs/database.config";

router.get("/seed", async (req, res) => {
    try {
        // Comprobar si ya existen datos en la tabla foods
        const result = await dbConnect`SELECT COUNT(*) as count FROM foods`;
        const foodsCount = parseInt(result[0].count, 10);

        if (foodsCount > 0) {
            res.send("Seed is already done!");
            return;
        }

        // Insertar datos en la tabla foods
        for (const food of sample_foods) {
            await dbConnect`
                INSERT INTO foods (id, name, price, tags, favorite, stars, image_url, origins, cook_time)
                VALUES (${food.id}, ${food.name}, ${food.price}, ${food.tags}, ${food.favorite}, ${food.stars}, ${food.imageUrl}, ${food.origins}, ${food.cookTime})
            `;
        }

        res.send("Seed Is Done!");
    } catch (error) {
        console.error("Error durante el seed:", error);
        res.status(500).send("Error interno del servidor!");
    }
});

router.get('/', asyncHandler(async (req, res) => {
    const foods = await dbConnect`SELECT * FROM foods`;
    res.send(foods);
}));

router.get('/search/:searchTerm', asyncHandler(async (req, res) => {
    const searchTerm = `%${req.params.searchTerm}%`;
    const foods = await dbConnect`SELECT * FROM foods WHERE name ILIKE ${searchTerm}`;
    res.send(foods);
}));

router.get('/tags', asyncHandler(async (req, res) => {
    const tags = await dbConnect`
        SELECT unnest(tags) as tag, COUNT(*) as count
        FROM foods
        GROUP BY unnest(tags)
        ORDER BY count DESC
    `;
    const totalFoods = await dbConnect`SELECT COUNT(*) as count FROM foods`;
    const all = {
        name: 'All',
        count: parseInt(totalFoods[0].count, 10)
    };
    tags.unshift(all);
    res.send(tags);
}));

router.get('/tag/:tagName', asyncHandler(async (req, res) => {
    const tagName = req.params.tagName;
    const foods = await dbConnect`SELECT * FROM foods WHERE ${tagName} = ANY(tags)`;
    res.send(foods);
}));

router.get('/:foodId', asyncHandler(async (req, res) => {
    const foodId = parseInt(req.params.foodId, 10);
    const food = await dbConnect`SELECT * FROM foods WHERE id = ${foodId}`;
    if (food.length > 0) {
        res.send(food[0]);
    } else {
        res.status(404).send('Food not found');
    }
}));

export default router;
