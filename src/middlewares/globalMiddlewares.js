let { json, static, urlencoded } = require('express')
const expressRateLimit = require('express-rate-limit')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')

/**
 * @Desc: Global Middlewares
 * @middleware : Rate Limitation Middleware
 * @middleware : Static Path Middleware
 * @middleware : json parser middleware
 * @middleware : cookieParser Middleware
 */
const globalMiddlewares = [
  morgan('dev'),
  // cors({ origin: 'http://localhost:3009', credentials: true }),
  cors(),
  // cookieParser(),
  expressRateLimit({
    windowMs: 1 * 60 * 1000, // 1 Munite
    max: 100, // How many Request Excepted Each 1 Munite
    message: 'Too many request from this IP, please try again after 10 Munite',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
  static(path.join(__dirname, '../../public')),
  json(),
  urlencoded({ extended: false }),
  // Add Live photo url to req object
  (req, res, next) => {
    const photo_url = `${req.protocol}://${req.get('host')}/uploads/products`
    req.photo_url = photo_url
    next()
  },
]
module.exports = globalMiddlewares
