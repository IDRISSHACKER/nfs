import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module';
import * as fs from "fs";
import {join} from "path";
import {STORAGE_PATH, TMP_PATH} from "./common/contant/env";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  const storage = join(process.cwd(), STORAGE_PATH)
  const tmp_storage = join(process.cwd(), TMP_PATH)
  if(!fs.existsSync(storage)){
    fs.mkdirSync(storage)
  }
  if(!fs.existsSync(tmp_storage)){
    fs.mkdirSync(tmp_storage)
  }
  await app.listen(3000)
}
bootstrap();
