var UserModel = require("./dosocial_media");
var PostModel = require("./post");
var comments = require("./comments");
var likes = require("./likes");
var restaurant = require("./Restaurant")
var middlewares = require("./middleware/authoring")
var ejs  = require('ejs');
var jwt = require('jsonwebtoken');

var express = require('express');
var bodyParser = require('body-parser');
const Mongoose = require("mongoose");
var ObjectId = Mongoose.mongo.ObjectId;

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//user
app.post('/user',function(req,res){
    try{
    if(req)
    {
        
        user_obj = {
            name:req.body.name,
            type:req.body.type,
            email:req.body.email,
            password:req.body.password,
            device_type:req.body.device_type,
            device_token:req.body.device_token,
            address:req.body.address,
            location: {
                type: "Point",
                coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            },  
            lat: parseFloat(req.body.lat),
            long:parseFloat(req.body.long),  
        }
        UserModel.create(user_obj,function(err,success){
            
            if(err)
            {
                return res.json({
                    message:err.message,
                    success:false,
                    status:400
                });
            }
            if(success)
            {
               var postObj = {
                    _id:success._id,
                    name:success.name,
                    type:req.body.type,
                    email:success.email,
                    password:success.password,
                    device_type:success.device_type,
                    device_token:success.device_token,
                    lat:success.lat,
                    long:success.long
                }
                jwt.sign(postObj,'sdfiua7938r',function(token_err,token_success){
                    if(token_success)
                    {
                        postObj.token = token_success;
                        return res.json({
                            token: postObj.token,
                            message:"Your information stored.",
                            success:true,
                            status:200 
                        });
                    }
                    if(token_err)
                    {
                        return res.json({
                            err:true,
                            message:token_err,
                            status:400
                        });
                    }
                });
            }
        });
    }
    else
    {
        return res.json({
            error:true,
            message:"Something went Wrong",
            status:400
        });
    }
}catch(error)
{
    return res.json({
        error:true,
        message:error.message,
        status:400
    });
}
});
//create-post
app.post('/create-post',function(req,res){

    var user = req.headers.authorization.split(' ')[1];
    console.log("user ==",user);
    var c = jwt.verify(user, 'sdfiua7938r');
    console.log("user ==",c);
    //console.log(ObjectId(user));
    var post_obj = {
        user_id:c._id,
        caption:req.body.caption
    }
    PostModel.create(post_obj, function(post_err, post_success){
        if(post_err)
        {
            return res.json({
                message:post_err,
                status:400
            });

        }
        if(post_success)
        {
            return res.json({
                message:"Operation Completed!...",
                status:200
            });
        }
    });
});
//comments
app.post('/comments',function(req,res){
    var user = req.headers.authorization.split(' ')[1];
    var u = jwt.verify(user,'sdfiua7938r');
    var comment_obj = {
        comment:req.body.comment, 
        user_id: u._id,
        post_id: req.body.post_id,
        created_at:Date.now(),
    }
    comments.create(comment_obj,function(err,success){
        if(err)
        {
            return res.json({
                message:err,
                status:400
            });

        }
        if(success)
        {
            return res.json({
                message:"Operation Completed!...",
                status:200
            });
        }
        
    });

});
//likes
app.post('/likes',function(req,res){
    var user = req.headers.authorization.split(' ')[1];
    var u = jwt.verify(user,'sdfiua7938r');
    var comment_obj = {
        like_status:req.body.like_status, 
        user_id: u._id,
        post_id: req.body.post_id,
        created_at:Date.now(),
    }
    likes.create(comment_obj,function(err,success){
        if(err)
        {
            return res.json({
                message:err,
                status:400
            });

        }
        if(success)
        {
            return res.json({
                message:"Operation Completed!...",
                status:200
            });
        }
        
    });

});
//restaurant
app.post('/restaurant',function(req,res)
{
    restaurant_obj = {
        name:req.body.name,
        address:req.body.address,
        location: {
            type: "Point",
            coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
        },  
        lat: parseFloat(req.body.lat),
        long:parseFloat(req.body.long),  
    }
    restaurant.create(restaurant_obj,function(err,sucess){
        if(sucess)
        {
            return res.json({
                message:sucess,
                sucess:true,
                status:200
            });
        }
        if(err)
        {
            return res.json({
                message:err,
                error:true,
                status:400
            });
        }
        else
        {
            return res.json({
                message:sucess,
                err:true,
                status:404
            });
        }
    });
});
//get-all-restaurants
app.get('/get-all-resturants', function(req,res){
    rest  = req.headers.authorization.split(' ')[1];
    restv = jwt.verify(rest,'sdfiua7938r');
    restaurant.aggregate([
        {
            $geoNear:{
                near: { type: "Point", coordinates: [ restv.long, restv.lat ] },
                distanceField: "dist.calculated",
                maxDistance: 50*1000,
                distanceMultiplier:1/1000,
                spherical: true
            }
        }
    ], function(error, success){
        console.log('success', success);
        console.log('error', error);

        return res.json({
            message:'rastaurant found successfully.',           
            data:success,
            status:200
        });
    });
});
//get-post of user
app.set('view engine', 'ejs');
app.get('/get-post',middlewares.checker,function(req,res)
{
    //res.render('./template/design');
    PostModel.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"user_id",
                foreignField:"_id",
                as:"user"
            }
        },
        {
            $limit:3
        },
        {
            $unwind:"$user"
        },
        
        {
            $addFields:
            {
                add:{
                    "Info":"Image sucessfully fetched"
                }
            }
        },
        {
            $set:{
                    "plmnko":"qazwsx"
            }
        },
        {
            
            $skip:1
        },
        {
            $sort : { 
                "_id":-1
            } 
        },
        {
            $project:{
                add:1,
                plmnko:1,
                qwert:1,
                user_id:1,
                caption:1,
                created_at:1,
                "user.name":{ $concat: [ "$user.name", " ", "America" ] },
                "user._id":1
            }
        }
    ], function(error, success)
    {
           

            if(error)
            {
                return res.json({
                    error:true,
                    message:error.message,
                    status:400
                });
            }

            if(success)
            {
                return res.json({
                    data:success,
                    success:true,
                    message:"post found.",
                    status:200
                });
            }
    });
    // PostModel.find({user_id:u._id},function(err,sucess){
    //     if(sucess)
    //     {
    //         for(var i=0;i<sucess.length;i++)
    //         {
    //             console.log("user_name  =",u.name)
    //             console.log("user_id = ",sucess[i].user_id);
    //             console.log("caption = ",sucess[i].caption);
    //         }
    //     }
    //     if(err)
    //     {
    //         return res.json({
    //             error:true,
    //             message:err,
    //             status:400
    //         });
    //     }

    //     if(success)
    //     {
    //         return res.json({
    //             success:true,
    //             message:'post found.',
    //             status:200
    //         });

    //     }

    //}); 
});
//get-all comments
app.get('/get-all-comments/:post',function(req,res){
    console.log(req.body);
    comments.aggregate([
        {
            $lookup:{
                from:"posts",
                localField:"post_id",
                foreignField:"_id",
                as:"post"
            }
        },
        {
            $unwind:"$post"
        },
   
        { $match:
            { 
                post_id:ObjectId(req.params.post)
            } 
        },
        
        {
            $project:{
                post_id:1,
                comment:1,
                created_at:1,
            }
        },
        
    ],function(err,sucess){
        console.log(err);
        console.log(sucess);
        if(err)
        {
            return res.json({
                error:true,
                message:err,
                status:400,
            })
        }
        if(sucess)
        {
            return res.json({
                sucess:true,
                message:sucess,
                status:200
            });
        }
    });
    // user = req.headers.authorization.split(' ')[1];
    // u = jwt.verify(user,'sdfiua7938r');

    // comments.find({post_id:req.query.post_id},function(err,sucess){
    //     if(sucess)
    //     {
    //         for(var i=0;i<sucess.length;i++)
    //         {
    //             console.log(sucess[i].comment),
    //             console.log(sucess[i].user_id),
    //             console.log(u.name),
    //             console.log(sucess[i].created_at)
    //         }
    //     }
    // });    
    //console.log(req.query.post_id);
    //console.log(req.params.data)
});
//get-like-count
app.get('/get-like-count',function(req,res){
    user = req.headers.authorization.split(' ')[1];
    u = jwt.verify(user,'sdfiua7938r');
    likes.find({post_id:req.query.post_id},function(err,sucess){
        var count = 0
        if(sucess)
        {
            for(var i=0;i<sucess.length;i++)
            {
                if(sucess[i].like_status===1)
                {
                    count++;
                }
            }
            return res.json({
                count:count,
                post_id:req.query.post_id,
                user_id:u._id,
                user_name:u.name
            });
            
        }


    });
});
app.listen(8082,function(){
    console.log("8082 Port Activated..........")
});
            