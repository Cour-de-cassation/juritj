export class BucketError extends Error {
  constructor(reason: string) {
    super(`Erreur sur l'API S3 : ${reason}`)
  }
}
