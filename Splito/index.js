const express = require('express');
const splitoServer = express.Router();

splitoServer.get("/",(req,res)=>{
    console.log("____________ ok 200 res from versionOne");
    try{
        res.status(200).json({error:false,msg:"inside server ok"});
        console.log("____________ ok 200 res from versionOne");
    }catch(err){
        res.status(500).json({error:false,msg:"versionOne server ok"});
        console.log("____________ 500 res from versionOne");
    }
});  


module.exports = {
    splitoServer
}; 