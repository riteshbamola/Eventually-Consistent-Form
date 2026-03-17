import express, { Application, Request, Response } from 'express'
import cors from 'cors';

import formRouter from "./routes/form";
const app: Application = express()
const PORT = process.env.PORT || 3000


app.use(cors({origin: '*'}));
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'Server is running' })
})
app.use("/api",formRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app