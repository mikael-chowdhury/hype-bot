const c = require("colors")

module.exports = class LoggerPriority {
    static LOW = c.gray
    static MEDIUM = c.yellow
    static HIGH = c.red
}