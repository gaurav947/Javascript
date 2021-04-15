var mongoose = require('mongoose');
//var Schema = mongoose.Types.ObjectId;
mongoose.connect("mongodb://localhost:27017/social_site",{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log("Social_media Database through Posts..."))
.catch((err)=>console.log(err));
var post_schema = new mongoose.Schema({
    user_id : {type:mongoose.Types.ObjectId,ref:"user"},
    image:{type:String},
    caption:{type:String}
});
module.exports = new mongoose.model("post",post_schema);