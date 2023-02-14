import {Injectable} from '@nestjs/common';
import {nfsResoler} from "./function/resolvers";
import * as fs from "fs";
import {QUALITY} from "./common/contant/env";
import sharp = require('sharp');

@Injectable()
export class AppService {
  getHello(): string {
    return 'NFS STORAGE!';
  }

  async optimize(file: string){
    const tmpPath = nfsResoler(file, true)
    const nfsPath = nfsResoler(file)

    const optimisedForFullScreen = await sharp(tmpPath)
        .webp()
        .resize(QUALITY.low.value)
        .toFile(nfsPath.split(".")[0]+QUALITY.low.prefix)

    const optimisedForLowScreen = await sharp(tmpPath)
        .webp()
        .resize(QUALITY.high.value)
        .toFile(nfsPath.split(".")[0]+QUALITY.high.prefix)

    const optimisedForJpeg = await sharp(tmpPath)
        .jpeg({ mozjpeg: true })
        .toFile(nfsPath.split(".")[0]+".jpeg")

    optimisedForFullScreen && optimisedForLowScreen && optimisedForJpeg && fs.rmSync(tmpPath)
  }

  getFile(file:string, quality: Quality):string{
    const nfFile =
        nfsResoler(file)
            .split('.')[0] + (quality === 'high' || quality === 'low' ?  quality : 'low') + ".webp"

    console.log('request', nfFile)
    return nfFile
  }

  removeFile(file:string){
    const initialFile = nfsResoler(file).split(".")[0]
    const allSufix = [".jpeg", QUALITY.high.prefix, QUALITY.low.prefix]

    allSufix.forEach((sufix:string)=>{
      console.log("deleting", initialFile+sufix)
      fs.rm(initialFile+sufix, ()=>{})
    })
  }

}

