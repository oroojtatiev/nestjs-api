import {NestFactory} from '@nestjs/core'
import {ConfigService} from '@nestjs/config'
import {AppModule} from './app.module'
import {ExceptionFilter} from './filters/http-exception.filter'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')

  app.useGlobalFilters(new ExceptionFilter(configService))

  await app.listen(3000)
}

void bootstrap()
