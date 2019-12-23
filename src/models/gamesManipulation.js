const connection=require('../utilities/connection');

// const Cryptr = require('cryptr');
// const cryptr = new Cryptr('myTotalySecretKey');

const md5= require('md5');

let gamesArr={};

//userName  Rubin Benno  password Rubin Benno@1234

gamesArr.register=(userName,password)=>{
    return connection.getUsers().then(model=>{
        return model.find({userName:userName}).then(data=>{
            if(data.length>=1){
                return {"message":"Oops !!! Username already exists!!"};
            }else{
                let encryptedPass=md5(password);
                var obj=
                    {   "userName":userName,
                        "password":encryptedPass
                    }
                return model.insertMany(obj).then(data=>{
                    // console.log(data);
                    if(data.length>=1){
                        return {"message":"You have successfully registered!!"}
                    }
                }).catch(err=>{
                    throw err;
                })
            }
        }).catch(err=>{
            throw err;
        })
    }).catch(err=>{
        throw err;
    })
}
gamesArr.login=(userName,password)=>{
    return connection.getUsers().then(model=>{
        return model.find({userName:userName}).then(data=>{
            //console.log(data);
            if(data.length>=1){
                let passWordEncrypted=md5(password);
                if(passWordEncrypted==data[0]['password']){
                    
                    return {"message":"You have login successfully!!"};
                }else{
                    return {"message":"Password is wrong"};
                }
            }else{
                let err="UserName doesnt exist";
                return {"message":err};
            }
        }).catch(err=>{
            throw err;
        })
    }).catch(err=>{
        throw err;
    })
}
gamesArr.updatePassword=(userName,updatePass)=>{
    return connection.getUsers().then(model=>{
        let updatedEncryptedPass=md5(updatePass);
            return model.update({userName:userName},
                {$set:{password:updatedEncryptedPass}}).then(data=>{
                    if(data.nModified>=1){
                        return {"message":"Password updated successfully"}
                    }
                }).catch(err=>{
                    throw err;
            })
    }).catch(err=>{
        throw err;
    })
}
gamesArr.checkTournament=(gameName,tournamentName)=>{
    return connection.getCollection().then(model=>{
        return model.find({$and:[{"gameName":gameName},
        {"gameArray":{$elemMatch:{"tournamentName":tournamentName}}}]}).then(data=>{
            if(data.length>=1){
                return "error";
            }else{
                return "OK";
            }
        }).catch(err=>{
            throw err;
        })
    }).catch(err=>{
        throw err;
    })
}

gamesArr.addGames=(req)=>{
    return connection.getCollection().then(model=>{
       /// console.log("req",req.tournamentDesc);
        
        var obj={   
                        
                        "tournamentName":req.tournamentName,
                        "tournamentDesc":req.tournamentDesc,
                        "registrationFees":req.registrationFees,
                        "maxPeople":req.maxPeople,
                        "creatorId":req.creatorId
                    }
return model.find(
    {$and:[{"gameName":req.gameName},
        {"gameArray":{$elemMatch:{"tournamentName":req.tournamentName}}}]})
        .then(dataCheck=>{
            if(dataCheck.length==0){
                return model.update({'gameName':req.gameName},{$push:{gameArray:obj}}).then(data=>{
                    if(data.nModified>=1){
                        //console.log(data);
                        return {"message":"Tournament Successfully added !! "};
                        //res.json({message:"Data is successfully added !!"})
                    }
                }).catch(err=>{
                    throw err;
                })
            }else{
                return {"message":"Tournament already exists"}
            }
    })
})
}
gamesArr.getGamesonNames=(gameName,page)=>{
    return connection.getCollection().then(model=>{
        let pageLimitSize=20;
        let start=page+((page-1)*pageLimitSize)-1;
        
        return model.find({'gameName':gameName},{gameArray:{$slice:[start,21]}}).then(data=>{
            if(data.length>=1){
               //console.log(data[0]['gameArray'].length);
                return data;
            }
        }).catch(err=>{
            throw err;
        })
    })
}

gamesArr.bookTournaments=(gameName,tournamentName)=>{
    return connection.getCollection().then(model=>{
        return model.aggregate([
            {$match:{'gameName':gameName}},
            { $unwind:"$gameArray"},
            {$match:{'gameArray.tournamentName':tournamentName}}]).then(data=>{
            //console.log("data from aggregation",data[0]['gameArray']['maxPeople']);
            let maxCount=data[0]['gameArray']['maxPeople'];
            let newMax=maxCount-1;
            if(maxCount>=1){
                return model.update(
                    {gameArray:{$elemMatch:{tournamentName:tournamentName}}},
                    { $set: { "gameArray.$.maxPeople" : newMax }}).then(data=>{
                      //console.log("data from setting macx people",data);
                        if(data.nModified==1){
                            return {"message":"You have registered successfully!!"};
                            }
                        })}else{
                         let err=new Error("Sorry the game is already full !! ");
                         throw err;
                    }
            
        })
    })
}



module.exports=gamesArr;