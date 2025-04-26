import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware";
import { prismaClient } from "@repo/database/client"


const app = express();

app.use(cors())
app.use(express.json())

app.post("/signup", async (req, res) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body)
        if (!parsedData.success) {
            res.json({
                message: "Invalid inputs"
            })
            return
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data?.username
            }
        });

        if (user) {
            res.status(411).json({
                message: "User aleady exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

        prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                name: parsedData.data.name,
                password: hashedPassword
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }

})

app.post("/signin", (req, res) => {

    const data = SignInSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message: "Invalid inputs"
        })
        return
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token: token
    })
})

app.post("/room", authMiddleware, (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message: "Invalid inputs"
        })
        return
    }
    res.json({
        roomId: 123
    })
})


app.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
});

