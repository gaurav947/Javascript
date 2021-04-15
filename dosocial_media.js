var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/social_site",{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log("Social_media Database through user..."))
.catch((err)=>console.log(err));

var user_schema = new mongoose.Schema({
    name:{type:String,required:true,minlength:6},
    type:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    device_type:{type:String,required:true},
    device_token:{type:String,required:true},
    location:{
        type:{type:String},
        coordinates:{type:[]}
    },
    lat:{
        type:Number,
        default:0
    },
    long:{
        type:Number,
        default:0
    },
});

// var user1_schema = new mongoose.Schema({
//     name:{type:String,required:true,minlength:6},
//     email:{type:String,required:true},
//     password:{type:String,required:true},
//     latitude:{type:String},
//     longitude:{type:String},
//     device_type:{type:String,required:true},
//     device_token:{type:String,required:true}
// });


module.exports = new mongoose.model("user",user_schema);
