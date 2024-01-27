import {PipeTransform, ArgumentMetadata, BadRequestException} from '@nestjs/common'
import {ZodError, ZodIssue, ZodSchema} from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (typeof value === 'string' || metadata.type !== 'body') return value

      return this.schema.parse(value)
    }
    catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((i: ZodIssue) => {
          return `${i.path} ${i.message}`
        })
        throw new BadRequestException(errorMessages)
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
