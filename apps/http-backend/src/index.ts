import express, { Request, Response } from "express"
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

app.post("/signup", async (req: Request, res: Response) => {
    try {
        const parsedData = await CreateUserSchema.safeParse(req.body)
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid inputs",
                errors: parsedData.error.flatten(),
            })
            return
        }

        const { username, password, name } = parsedData.data;


        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: username
            }
        });

        if (existingUser) {
            res.status(411).json({
                message: "User aleady exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: username,
                name: name,
                password: hashedPassword
            }
        })

        res.status(201).json({
            userId: user.id,
            message: "User created successfully"
        });
        return

    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }

})

app.post("/signin", async (req: Request, res: Response) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body)
        if (!parsedData.success) {
            res.status(400).json({
                message: "Invalid inputs",
                errors: parsedData.error.flatten(),
            })
            return
        }

        const { username, password } = parsedData.data

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: username,
            }
        });

        if (!existingUser) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return
        }
        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if (!isValidPassword) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return
        }

        const userId = existingUser.id;
        const token = jwt.sign({
            userId
        }, JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
            userId: userId,
            token: token,
            message: "Sign in succesfull!"
        });
        return

    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
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

