import * as Joi from 'joi'

export const envValidationConfig = {
  cache: true,
  validationSchema: Joi.object({
    DOC_LOGIN: Joi.string().required(),
    DOC_PASSWORD: Joi.string().required(),
    MONGODB_URL: Joi.string().required(),
    S3_URL: Joi.string().required(),
    S3_ACCESS_KEY: Joi.string().required(),
    S3_SECRET_KEY: Joi.string().required(),
    S3_REGION: Joi.string().required(),
    S3_BUCKET_NAME_RAW: Joi.string().required(),
    S3_BUCKET_NAME_NORMALIZED: Joi.string().required()
  })
}
