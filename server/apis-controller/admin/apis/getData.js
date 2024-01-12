const { MongoClient } = require('mongodb');

const DB_URL = process.env.DB_URL;
const { ObjectId } = require('mongodb');
const { ApiAuthentication } = require('../../../utils/ApiAuthentication');
const { Messages } = require('../../../Constaints');

async function getDirectData(req, res) {

  if(!ApiAuthentication(req, res)){
    return res.json({ status: false, message: Messages.wrongApi});
}
  const { filter, select, sort, skip, collection, limit } = req.query;
  const client = new MongoClient(DB_URL); // Replace with your connection URI
  await client.connect();
  try {

    const db = client.db(); // Replace with your database name
    const col = db.collection(collection); // Replace with your collection name


    // Handle empty objects
    let finalFilter = filter || '{}'
    let finalProjection = select || '{}';
    let finalSort = sort || '{}';
    const finalSkip = typeof(skip) === 'string' ? parseInt(skip) : skip || 0;
    const finalLimit = typeof(limit) == 'string' ? parseInt(limit) : limit || 0; // Use undefined for no limit

    finalFilter = JSON.parse(finalFilter);
    finalProjection = JSON.parse(finalProjection);
    finalSort = JSON.parse(finalSort);

    if(finalFilter['_id']){
      finalFilter['_id'] = new ObjectId(finalFilter['_id']);
    }

    await col.find(finalFilter)
    .sort(finalSort)
    .project(finalProjection)
    .skip(finalSkip)
    .limit(finalLimit)
    .toArray().then((result, err) => {
      if(err) throw err;
      res.send({
        status: true,
        message: `${collection} get`,
        data: result
      });
    })

  } catch (error) {
    console.error(error);
    client.close();
    res.json({
      status: false,
      message: `${error}`
    })
  } finally {
    client.close();
  }
}

module.exports = getDirectData;