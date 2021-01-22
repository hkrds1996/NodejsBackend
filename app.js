require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//remote db
mongoose.connect("mongodb+srv://"+process.env.MONGODB_Account+":"+process.env.MONGODB_DB_PASSPORT+"@cluster0.1mkpl.mongodb.net/"+process.env.MONGODB_DB+"?retryWrites=true&w=majority", {useNewUrlParser:true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
  });
const Articles = mongoose.model("Articles",articleSchema);

const userSchema = new mongoose.Schema({
    userName: String,
    API:String
})
const Users = mongoose.model("Users",userSchema);

app.route("/articles").get(function(req, res){
    console.log("sads");
    Articles.find({}, function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            res.send(foundArticles);
        }
    });
}).post(function(req,res){
    const userApi = req.body.API;
    const verify = Users.findOne({API:userApi},(err, foundUser)=>{
        if(err){
            return false;
        }else{
            if(!foundUser){
                return false;
            }else{
                return true;
            }
        }
    });
    if(verify){
        const newArticle = new Articles({
            title:req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(err){
                res.send(err);
            }else{
                res.send("saved successfully.");
            }
        });    
    }
    
}).delete(function(req, res){
    Articles.deleteMany(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("deleted successfully.")
        }
    });
});

app.route("/articles/:articleTitle").get(function(req, res){
    Articles.findOne({title:req.params.articleTitle}, function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            if(foundArticles){
                res.send(foundArticles);
            }else{
                res.send("the article doesn't exist");
            }           
        }
    });
}).post(function(req,res){
    Articles.updateOne({title:req.params.articleTitle}, 
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("update successful update");
            }
    });
}).patch(function(req,res){
    Articles.updateOne({title:req.params.articleTitle}, 
        {$set: req.body},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("patched successful update");
            }
    });
})
.delete(function(req, res){
    Articles.deleteOne({title: req.params.articleTitle},function(err){
        if(err){
            res.send(err);
        }else{
            res.send("deleted successfully.")
        }
    });
});

let port = process.env.PORT ;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});