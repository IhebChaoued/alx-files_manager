const { MongoClient, ObjectId } = require('mongodb');
const dbClient = require('../utils/db');

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = connection.db();
});

afterAll(async () => {
  await connection.close();
});

describe('Database Client Tests', () => {
  it('should insert and find a document in the database', async () => {
    const collection = db.collection('testCollection');
    const document = { name: 'Test Document' };

    await collection.insertOne(document);
    const insertedDocument = await collection.findOne({ name: 'Test Document' });

    expect(insertedDocument).toEqual(document);
  });

  it('should update a document in the database', async () => {
    const collection = db.collection('testCollection');
    const document = { name: 'Test Document' };
    const update = { $set: { name: 'Updated Document' } };

    await collection.insertOne(document);
    await collection.updateOne({ _id: document._id }, update);

    const updatedDocument = await collection.findOne({ _id: document._id });

    expect(updatedDocument.name).toBe('Updated Document');
  });

  it('should delete a document from the database', async () => {
    const collection = db.collection('testCollection');
    const document = { name: 'Document to Delete' };

    await collection.insertOne(document);
    await collection.deleteOne({ _id: document._id });

    const deletedDocument = await collection.findOne({ _id: document._id });

    expect(deletedDocument).toBeNull();
  });
});
