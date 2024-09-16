import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res){

    const form = formidable()

    form.parse(req, async (err, fields, files) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ message: 'Error parsing the file' });
        }

        const file = files.image;

        if(!file){
            return res.status(400).json({ message: 'No file upload detected' });
        }

        // console.log('process.cwd(): ', process.cwd());//Good

        const uploadDir = path.join(process.cwd(), '/public');

        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileExtension = path.extname(file[0].originalFilename);
        const newFileName = `${Date.now()}${fileExtension}`;
        const newFilePath = path.join(uploadDir, newFileName);

        try{
            await fs.promises.rename(file[0].filepath, newFilePath);
            return res.status(200).json({ message: 'File Saved Successfully!'});
        }catch(error){
            return res.status(500).json({ message: error.message })
        }

    })

}