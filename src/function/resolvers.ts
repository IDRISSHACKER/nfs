import {STORAGE_PATH, TMP_PATH} from "../common/contant/env";

export const nfsResoler = (file: string, tmp:boolean=false): string=>(tmp ? TMP_PATH : STORAGE_PATH) + "/" + file
