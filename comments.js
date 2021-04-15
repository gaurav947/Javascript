var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/social_site",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("Social_site through comments"))
.catch((err)=>console.log(err));

var comment = new mongoose.Schema({
    comment:String, 
    user_id: {type:mongoose.Types.ObjectId,ref:"user"},
    post_id: {type:mongoose.Types.ObjectId,ref:"post"},
    created_at:{type:Date},
});
module.exports = new mongoose.model("comments",comment);