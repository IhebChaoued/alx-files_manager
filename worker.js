import Bull from 'bull';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';

const fileQueue = new Bull('fileQueue');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const fileDocument = await dbClient.db.collection('files').findOne({
    _id: new ObjectId(fileId),
    userId: new ObjectId(userId),
  });

  if (!fileDocument) {
    throw new Error('File not found');
  }

  const sizes = [500, 250, 100];
  const localPath = fileDocument.localPath;

  for (const size of sizes) {
    const options = { width: size };
    try {
      const thumbnail = await imageThumbnail(localPath, options);
      fs.writeFileSync(`${localPath}_${size}`, thumbnail);
    } catch (error) {
      console.error(`Error generating thumbnail for size ${size}:`, error.message);
    }
  }
});

fileQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

fileQueue.on('failed', (job, err) => {
  console.log(`Job failed: ${job.id} - ${err.message}`);
});

console.log('Worker started');
