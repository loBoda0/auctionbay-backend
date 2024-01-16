import fs from 'fs';
import { Options, diskStorage } from "multer";
import path, { extname } from "path";
import Logging from 'src/library/Logging';

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files',
    filename(req, file, callback) {
      // Create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      // Get file extension
      const ext = extname(file.originalname)
      // Write filename
      const filename = `${uniqueSuffix}${ext}`

      callback(null, filename)
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes
    allowedMimeTypes.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false)
  },
}

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = extname(fullFilePath).toLowerCase();

  return allowedExtensions.includes(fileExtension);
}

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath)
  } catch (error) {
    Logging.error(error)
  }
}