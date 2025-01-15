import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/db.js'
import './config/instrument.js'
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controller/webhook.js'

const app = express()
const PORT = process.env.PORT || 5000

await connectDb()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=> res.send("API WORKING"))
app.get('/debug-sentry',function mainHandler(req,res){
    throw new Error("My first Sentry error");
})
app.post('/webhooks',clerkWebhooks)




Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})