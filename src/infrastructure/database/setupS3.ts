import * as AWS from 'aws-sdk'

export class SetupS3 {
  private client
  constructor() {
    if (!this.client) {
      this.client = new AWS.S3({
        endpoint: process.env.SCW_S3_URL,
        region: process.env.SCW_S3_REGION,
        credentials: {
          accessKeyId: process.env.SCW_S3_ACCESS_KEY,
          secretAccessKey: process.env.SCW_S3_SECRET_KEY
        }
      })
    }
  }
  getApiClient() {
    return this.client
  }
}
