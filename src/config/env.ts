import dotenv from 'dotenv'
import { MissingValue } from '../services/error'

if (!process.env.ENV) dotenv.config()

if (process.env.S3_URL == null) throw new MissingValue('process.env.S3_URL')
if (process.env.S3_ACCESS_KEY == null) throw new MissingValue('process.env.S3_ACCESS_KEY')
if (process.env.S3_SECRET_KEY == null) throw new MissingValue('process.env.S3_SECRET_KEY')
if (process.env.S3_REGION == null) throw new MissingValue('process.env.S3_REGION')
if (process.env.S3_BUCKET_NAME_RAW == null) throw new MissingValue('process.env.S3_BUCKET_NAME_RAW')
if (process.env.FILE_DB_URL == null) throw new MissingValue('process.env.FILE_DB_URL')

export const {
  S3_URL,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  S3_REGION,
  S3_BUCKET_NAME_RAW,
  FILE_DB_URL,
  ENV,
  PORT = 3000
} = process.env
