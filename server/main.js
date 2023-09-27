const express = require("express");
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});
const objectId = require("mongodb").ObjectId;
const cors = require("cors");
const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
  minScore: 0,
  maxSimilarDocuments: 100
});
const proj = {
  _id: 1,
  name: 1,
  description: 1,
  year: 1,
  alternativeName: 1,
  movieLength: 1,
  shortDescription: 1,
  poster: {
    url: 1
  },
  rating: {
    kp: 1,
    imdb: 1
  },
  votes: {
    kp: 1,
    imdb: 1
  },
  watchability: {
    items: {
      logo: {
        url: 1
      },
      name: 1,
      url: 1
    }
  }
};

(async () => {
  try {
    await client.connect();
    app.locals.collection = client.db("Filmsdb").collection("films");
    await trainRecommender();
    await app.listen(process.env.PORT, () => {
      console.log("Server is ready.");
    });
  } catch (err) {
    return console.log(err);
  }
})();

app.use(cors());

app.get("/list", async (req, res) => {
  const collection = app.locals.collection;
  try {
    const result = await collection.find().project(proj).toArray();
    if (result) {
      fixRes(result);
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/recs/:id", async (req, res) => {
  const collection = app.locals.collection;
  const id = req.params.id;
  const similar = recommender.getSimilarDocuments(id, 0, 10).map(d => new objectId(d.id));
  try {
    const result = await collection.find(
      { _id: { $in: similar } },
      { projection: proj }
    ).toArray();

    if (result) {
      fixRes(result);
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

async function trainRecommender() {
  const collection = app.locals.collection;
  const films = await collection.find().project({
    _id: 1,
    description: 1
  }).toArray();
  recommender.train(films.map((film) => ({ id: film._id, content: film.description })));
}

function fixRes(result) {
  for (let i = 0; i < result.length; i++) {
    result[i].poster = result[i].poster.url;
    result[i].watchability = result[i].watchability.items;
    if (result[i].watchability) {
      for (let j = 0; j < result[i].watchability.length; j++) {
        result[i].watchability[j].logo = result[i].watchability[j].logo.url;
      }
    }
  }
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("Server is down.");
  process.exit();
});