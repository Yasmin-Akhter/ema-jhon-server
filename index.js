const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taxqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('emajhon').collection('product');

        app.get('/products', async (req, res) => {

            const query = {};
            const cursor = productsCollection.find(query);
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }

            else {
                products = await cursor.toArray();
            }


            res.send(products);

        });

        //use post to get product by keys/id:

        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            console.log(keys);
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } }
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        app.get('/productsCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });

        });


    }

    finally {
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    console.log('hello');
    res.send('hello world');
});
app.listen(port, () => {
    console.log('listenning from port');
})
