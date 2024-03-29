// Required Modules:
const path = require('path')
const createError = require('http-errors')
const sharp = require('sharp')
const { unlinkSingleImage } = require('../../utils/files')

/**
 * @desc Single Image Convert To Webp Middleware, If already webp format return to next middleware()
 * @param {string} - Sub Folder Location
 * @response next middleware.
 */

const singleConvertToWebp = (subFolder) => async (req, res, next) => {
  try {
    if (path.extname(req.file.filename) === '.webp') {
      next()
    } else {
      sharp(
        path.join(
          __dirname,
          `../../../public/uploads/${subFolder}`,
          req.file.filename
        )
      ).toFile(
        path.join(
          __dirname,
          `../../../public/uploads/${subFolder}`,
          req.file.filename.replace(path.extname(req.file.filename), '.webp')
        ),
        (err, info) => {
          if (err === null) {
            unlinkSingleImage(req.file.link)
            req.file.link = req.file.link.replace(
              path.extname(req.file.filename),
              '.webp'
            )
            next()
          } else {
            unlinkSingleImage(req.file.link)
            next(createError(500, 'Failed To convert to webp'))
          }
        }
      )
    }
  } catch (error) {
    next(createError(500, error.message))
  }
}

// Module Exprots:
module.exports = { singleConvertToWebp }
