require('dotenv').config()

const express = require('express')
const app = express()
const routesRouter = require('./controllers/routes.js')
const router = require('./controllers/routes.js')

app.use(express.json())
app.use('/routes', routesRouter)


// if router starts with '/' apply router
app.use('/', router)

app.listen(3883, () => {
    console.log(`Hey, I am listening!`)
})
