require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

mongoose.connect(process.env.DBLINK,{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log(`DB connected!`)
    }

});

const {schema} = mongoose;

const articleSchema = {
    title: String,
    content: String

}

const Article = mongoose.model('Article',articleSchema);



app.route('/articles')
.get( (req, res)=>{

    Article.find({},(err, results)=>{

if(!err) {
   res.send(results)

} else {
res.send(err)
}
           
       
   })

})
.post( (req, res)=>{
   
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err)=>{
        if(!err){
            res.send("Added Sucsessfuly!")
        } else {
            res.send(err)
           }

    });
    
})
.delete( (req, res)=>{

Article.deleteMany({}, (err)=>{
    if(!err){
        res.send('Everything was Deleted!')
    } else {
        res.send(err)
       }
})


})


app.route('/articles/:article')
.get((req, res)=>{
Article.find({title:req.params.article}, (err, result)=>{
    if(!err){
        res.send(result)
    } else{
        res.send(err)
    }
})
})
.delete((req, res)=>{
    Article.findOneAndDelete({title:req.params.article},(err)=>{
        if(!err){
            res.send("deleted!")
        }else{
            res.send(err)
        }
    })
})
.put((req, res)=>{
    Article.replaceOne({title:req.params.article}, {title: req.body.title, content: req.body.content}, (err)=>{
        if(!err){
            res.send("Replaced!")
           
        }else{
            res.send(err)
        }
    })
})
.patch((req, res)=>{
    Article.updateOne({title:req.params.article}, {$set: req.body}, (err)=>{
        if(!err){
            res.send("updated!")
           
        }else{
            res.send(err)
        }
    })
})










app.listen(PORT,()=>{
    console.log(`app is online on port ${PORT}, http://localhost:${PORT}`)
})