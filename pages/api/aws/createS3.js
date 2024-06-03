"use server";
import AWS from 'aws-sdk';
export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      const boundary = req.headers['content-type'].split('; ')[1].split('=')[1];
      const parts = data.split(`--${boundary}`);
      const filePart = parts.find(part => part.includes('Content-Disposition: form-data; name="file";'));
      if (!filePart) {
        return reject(new Error('No file part found'));
      }

      const filenameMatch = filePart.match(/filename="(.+?)"/);
      if (!filenameMatch) {
        return reject(new Error('Filename not found'));
      }
      const filename = filenameMatch[1];
      const fileData = filePart.split('\r\n\r\n')[1].split('\r\n--')[0];
      resolve({ filename, fileData });
    });

    req.on('error', err => {
      reject(err);
    });
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("entered aws s3 create")
    try {
      const { filename, fileData } = await parseFormData(req);

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      const params = {
        Bucket: 'nmobiles',
        Key: filename,
        Body: Buffer.from(fileData, 'binary'),
      };
console.log("s3",s3,"params",params)
      try {
        const data = await s3.upload(params).promise();
        res.status(200).json({ message: 'File uploaded successfully', data });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
