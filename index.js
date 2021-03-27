const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'pL3gsGT6U1ZTe4bd'

const uri = "mongodb+srv://todolist:pL3gsGT6U1ZTe4bd@cluster0.0hcik.mongodb.net/todolist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const workCollection = client.db("todolist").collection("dalyRuten");
  
  app.get('/workName', (req, res) => {
      workCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/addWork/:id', (req,res) =>{
      workCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents) =>{
          res.send(documents[0]);
      })
  })
  
  app.post('/addWorks', (req, res) => {
    const work = req.body;
    workCollection.insertOne(work)
    .then(result => {
        res.redirect('/')
    })
  })  

  app.patch('/update/:id', (req,res) =>{
      console.log(req.body.name);
     workCollection.updateOne({_id: ObjectId(req.params.id)},
     {
        $set: {name: req.body.name}
     })
     .then(result => {
         res.send(result.modifiedCount > 0)
     })
  })

  app.delete('/delete/:id', (req, res) => {
      workCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then((result) => {
          res.send(result.deletedCount > 0)
      })
  })
  

});


app.listen(5000);