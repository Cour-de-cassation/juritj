import dotenv from 'dotenv'
import { MissingValue } from '../services/error'

if (!process.env.NODE_ENV) dotenv.config()

if (process.env.S3_URL == null) throw new MissingValue('process.env.S3_URL')
if (process.env.S3_ACCESS_KEY == null) throw new MissingValue('process.env.S3_ACCESS_KEY')
if (process.env.S3_SECRET_KEY == null) throw new MissingValue('process.env.S3_SECRET_KEY')
if (process.env.S3_REGION == null) throw new MissingValue('process.env.S3_REGION')
if (process.env.S3_BUCKET_NAME_RAW == null) throw new MissingValue('process.env.S3_BUCKET_NAME_RAW')
if (process.env.DBSDER_API_URL == null) throw new MissingValue('process.env.DBSDER_API_URL')
if (process.env.DBSDER_API_KEY == null) throw new MissingValue('process.env.DBSDER_API_KEY')
if (process.env.FILE_DB_URL == null) throw new MissingValue('process.env.FILE_DB_URL')
if (process.env.PORT == null) throw new MissingValue('process.env.PORT')

export const {
  NODE_ENV,
  PORT,
  S3_URL,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  S3_REGION,
  S3_BUCKET_NAME_RAW,
  DBSDER_API_URL,
  DBSDER_API_KEY,
  FILE_DB_URL
} = process.env
