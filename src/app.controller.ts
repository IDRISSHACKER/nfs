import {
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus,
  Ip,
  Next,
  Param,
  Post, Query,
  Res, StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {v4} from 'uuid';
import {extname, join} from 'path';
import {NextFunction} from "express";
import {TMP_PATH} from "./common/contant/env";
import * as fs from "fs";
import mine = require('mime-types');
import {createReadStream} from "fs";
import path = require("path")

const DRIVER_ROUTE = "drive"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post(DRIVER_ROUTE)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: TMP_PATH,

      filename(req, file, callback) {
        callback(null, v4()+extname(file.originalname));
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if(file){

      await this.appService.optimize(file.filename)

      console.log(file.filename + "= uploaded")

      return {
        file: file.filename
      }

    }else {
      throw new HttpException({
        message: 'Vous devez choisir un fichier'
      }, HttpStatus.FORBIDDEN)
    }
  }

  @Get(':filePath')
  async handleStreamFile(
      @Param('filePath') filePath:string,
      @Query('quality') quality : Quality,
      @Res({ passthrough: true }) res,
      @Ip() ip,
      @Next() next: NextFunction,
  ) {

    const pathFile = this.appService.getFile(filePath, quality)

    const rootToFile = join(
        process.cwd(),
        pathFile
    )

    if (!fs.existsSync(rootToFile)) {
      throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: 'The file was trying to get not found',
          },
          HttpStatus.NOT_FOUND,
      );
    }


    res.set({
      'Content-Type': mine.contentType(rootToFile),
    });
    const streamable = createReadStream(rootToFile);
    return new StreamableFile(streamable);
  }

  @Delete(`/${DRIVER_ROUTE}/:file`)
  deleteFile(@Param("file") file){
    this.appService.removeFile(file)
    return {
      status: "file deleting..."
    }
  }

}
