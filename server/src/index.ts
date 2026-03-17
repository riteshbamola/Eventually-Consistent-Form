import express, { Application, Request, Response } from 'express'
import cors from 'cors'

const app: Application = express()
const PORT = process.env.PORT || 3000


app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'Server is running' })
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app