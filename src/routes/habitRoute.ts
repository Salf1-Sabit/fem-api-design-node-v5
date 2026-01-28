import { Router } from "express";
import z from "zod";
import { validateBody, validateParams, validateQueryParams } from "../middlewares/validation.ts";

const router = Router();

const createHabitSchema = z.object({
    name: z.string().min(2)
});

const gethabitSchema = z.object({
    id: z.string().max(3)
});

router.get('/', (req, res) => {
    res.json({
        message: "habits"
    });
});

router.get('/:id', validateParams(gethabitSchema), (req, res) => {
    res.json({
        message: "got one habit"
    });
});

router.post('/', validateBody(createHabitSchema), (req, res) => {
    return res
    .status(201)
    .json({
        message: "created habit"
    });
});

router.delete('/:id', (req, res) => {
    res
    .status(204)
    .json({
        message: "deleted habit"
    });
});

router.post('/:id/complete', (req, res) => {
    res
    .status(201)
    .json({
        message: "completed habit"
    });
});

export default router;