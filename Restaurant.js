const { MongoServerSelectionError } = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/social_site",{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log("Social_site through Restaurant"))
.catch((err)=>console.log(err));

var restaurant = new mongoose.Schema({
    name:String,
    address: {type:String},
    location:{
        type: { type: String },
        coordinates: { type: []}            
    },
    lat:{
        type: Number,  
        default:0           
    },
    long:{
        type: Number,
        default:0             
    },
});
module.exports = new mongoose.model("Restaurant",restaurant);
restaurant.index({location: '2dsphere'});
