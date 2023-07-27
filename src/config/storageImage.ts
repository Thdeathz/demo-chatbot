import { DiskStorageOptions } from 'multer'

const storageImagePrefix: DiskStorageOptions = {
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
}

export default storageImagePrefix
