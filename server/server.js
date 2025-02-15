require('dotenv').config()

const express = require('express')
const sequelize = require('./config/database')
const models = require('./models/Block')
const cors = require('cors')
const router = require('./routes/blockRoutes')
const static = require('node:path')

const PORT = process.env.PORT || 5000

const App = express()
App.use(cors())
App.use(express.json())
App.use(express.static(static.resolve(__dirname, 'static')))
App.use('/api', router)


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        App.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()