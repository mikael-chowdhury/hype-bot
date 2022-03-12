const LoggerPriority = require("./LoggerPriority")

module.exports = class Logger {
    static log(message, priority=LoggerPriority.LOW){
        let date = new Date(Date.now())

        let seconds = date.getSeconds()
        let minutes = date.getMinutes()
        let hours = date.getHours()

        console.log(priority(seconds + ":" + minutes + ":" + hours + "  |  " + message))
    }
}