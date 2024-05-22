"use server"
import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
console.log({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })
    const { bucketName, key, body } = req.body;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
    };

    try {
      const data = await s3.putObject(params).promise();
      res.status(200).json({ message: 'File uploaded successfully', data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
