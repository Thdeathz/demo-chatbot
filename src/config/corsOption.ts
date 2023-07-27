import { CorsOptions } from 'cors'

const corsOptions: CorsOptions = {
  origin: (origin: any, callback: Function) => {
    callback(null, true)
  },
  credentials: true,
  optionsSuccessStatus: 200
}

export default corsOptions
