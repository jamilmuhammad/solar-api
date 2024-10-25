import { extname } from "path";

export class FileStringHelper {

    static customFileName(originalname) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(originalname);
        const realName = uniqueSuffix + fileExtName

        return realName;
    }
}