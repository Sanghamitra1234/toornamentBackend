//import connection from '../utilities/connection';
const connection=require('../utilities/connection');
const random_name = require('node-random-name');

const md5= require('md5');

var game={
"gameName":"Pubg",
"gameArray":[
        {   
            
            "tournamentName":"Pubg 1",
            "tournamentDesc":"Best Game Ever",
            "registrationFees":120,
            "creatorId":"C1001"
        }
    ]
}

var users={
    "userName":"",
    "password":""
}

function rand(limit){
    return Math.floor(Math.random()*limit);
};

function createUser(){
    var dummyData=[];
    var digits = ["!789","@1234","123","!123","*12@9","2345&"]
    for(let i=0;i<100000;i++){
        let name=random_name();
        if(dummyData.length==0){
            let pass=name+digits[rand(digits.length)]
            let encryptedPassword=md5(pass);
            let obj={
                userName:name,
                password:encryptedPassword
            }
            dummyData.push(obj);
        }
        else if(dummyData.length>=1){
            let index=dummyData.map(function(e){return e.userName}).indexOf(name);
                if(index==-1){
                    let pass=name+digits[rand(digits.length)];
                    let encryptedPassword=md5(pass);
                    let obj={
                        userName:name,
                        password:encryptedPassword
                    }
                    dummyData.push(obj);
                }
            }
    }

    return dummyData;
    
}
 function createDb() {
        var gamenames = ["PUBG","MLBB","FIFA 20"]
        var gamename = gamenames[rand(gamenames.length)]
        var gamename = "MLBB" //Fill with one name 
        var xarr = []
            
        for( var i=1;i<100000;i++){  
            var tournamentDescArray = ["Best Game Ever","Too comepetetive","Hard Game play","Hardcore game","Best match you will ever find","fight for life"]
            var tournamentName = gamename + i.toString()
            var tournamentDesc = tournamentDescArray[rand(tournamentDescArray.length)]
            var registrationFees = rand(500)
            var maxPeople = rand(100)
            var creatorId = "C" + (1000 + rand(50)).toString() 
            var x = {
                "tournamentName": tournamentName,
                "tournamentDesc": tournamentDesc,
                "registrationFees": registrationFees,
                "maxPeople": maxPeople,
                "creatorId": creatorId}
            xarr.push(x)
            // Save Note in the database
        }
        var dummydata = {
            "gameName": gamename,
            "gameArray": xarr
            };
           // console.log("dummydata",dummydata);
        return dummydata;
            
    }
   
exports.setUpNames=(req,res,next)=>{
    return connection.getUsers().then(model=>{
        let user=createUser();
        return model.insertMany(user).then(data=>{
            if(data.length>=1){
                return data;
            }
        }).catch(err=>{
            throw err;
        })
    })
}


exports.setupGames=(req,res,next)=> {
    return connection.getCollection().then(model=>{
            games=createDb();
        return model.insertMany(games).then(data=>{
            //console.log("data got inserted ",data);
            //res.send("OK");
            if(data.length>=1){
                return data;
            }
        }).catch(err=>{
            throw err;
        })
    })
}
