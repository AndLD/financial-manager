import dotenv from 'dotenv'
import { startApp } from './app'
import { consoleColors } from './utils/constants'
dotenv.config()

process.on('uncaughtException', (error) => {
    console.log(consoleColors.fgRed, `UncaughtException: ${error}`)
})

startApp()
