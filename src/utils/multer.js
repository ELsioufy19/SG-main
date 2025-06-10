import multer, {diskStorage} from 'multer';

export const typesObj = {
    img: ['image/png', 'image/jpeg']
}

const uploadFile = (type)=> {
    const fileFilter = (req, file, cb)=> {
        if(!type.includes(file.mimetype)) return cb(new Error("invalid data type"), false)
        return cb(null, true)
    }
    return multer({storage: diskStorage({}), fileFilter})
}

export default uploadFile;