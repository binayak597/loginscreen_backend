import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/myuserDB");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.post("/login", function(req, res){
    const {email, password} = req.body;
    User.findOne({email: email}).then(foundUser =>{
        if(foundUser){
            if(password === foundUser.password){
                  res.send({message: "Login is Successfull", foundUser});
            }else{
                res.send({message: "invalid credientials"});
            }
        }else{
                res.send({message: "User doesnot exist"});
            }
    });
});

app.post("/register", function(req, res){
    const {name, email, password} = req.body;
    
    User.findOne({email: email}).then(foundUser => {
        if(foundUser){
            res.send({message: "User already registered"});
        }else{
            const user = new User({
                name,
                email,
                password
            });
           user.save().then(() =>{
            res.send({message: "User successfully registered, Please login now."});
           }).catch(e => console.log(err));
        }
    });
});

let port = process.env.PORT;
if(port == null || port == ""){
    port = 8000;
}
app.listen(port, function(){
    console.log("server is running on port 8000");
});