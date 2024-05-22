import AWS from 'aws-sdk';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const { bucketName, key } = req.query;

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const data = await s3.getObject(params).promise();
      res.setHeader('Content-Type', data.ContentType);
      res.send(data.Body);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
