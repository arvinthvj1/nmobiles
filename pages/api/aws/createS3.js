import AWS from 'aws-sdk';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFile = (req) => {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);

    req.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    });

    req.on('end', () => {
      // Assuming the content type is 'application/octet-stream'
      const contentDisposition = req.headers['content-disposition'];
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
      
      if (!filenameMatch) {
        return reject(new Error('Filename not found in Content-Disposition header'));
      }

      const filename = filenameMatch[1];
      resolve({ filename, data });
    });

    req.on('error', err => {
      reject(err);
    });
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { filename, data } = await parseFile(req);

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      const params = {
        Bucket: 'nmobiles',
        Key: filename,
        Body: data,
      };

      try {
        const s3Data = await s3.upload(params).promise();
        res.status(200).json({ message: 'File uploaded successfully', data: s3Data });
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
