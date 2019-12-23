const express = require('express');
const routing = express.Router();
const setup = require('../models/dbSetUp');
const games=require('../models/gamesManipulation');


routing.get('/setup', (req, res) => {
        setup.setupGames().then(data=>{
            res.send("data inserted successfully");
        }).catch(err=>{
            throw err;
        })
});

routing.get('/setupUsers',(req,res)=>{
    setup.setUpNames().then(data=>{
        res.send("data iserted successfully!!");
    }).catch(err=>{
        throw err;
    })
})

// {
//     "userName" : "Rashad Sanghani",
//     "password" : "Rashad Sanghani!123"
//   }

routing.post('/register',(req,res)=>{
    games.register(req.body.userName,req.body.password).then(data=>{
        res.send(data);
    }).catch(err=>{
        throw err;
    })
})

routing.post('/login',(req,res)=>{
    games.login(req.body['userName'],req.body['password']).then(data=>{
        if(data){
            res.send(data);
        }
    }).catch(err=>{
        throw err;
    })
})

// {
//     "gameName":"Fifa",
//     "tournamentDesc":"sab khelte hai",
//     "registrationFees":200,
//     "creatorId":"C1001",
//     "tournamentName":"Fifa 1"
//  }
routing.get('/tournamentCheck/:gameName/:tournamentName',(req,res,next)=>{
    games.checkTournament(req.params.gameName,req.params.tournamentName).then(data=>{
        if(data=="error"){
            res.send("The tournament Name Already Exists");
        }else{
            res.send("Game can be added");
        }
    }).catch(err=>{
        throw err;
    })
})

routing.post('/updatePassword',(req,res,next)=>{
    games.updatePassword(req.body['userName'],req.body['password']).then(data=>{
        if(data){
            res.send(data);
        }
    }).catch(err=>{
        throw err;
    })
})

routing.post('/addGames',(req,res,next)=>{
    //console.log("data from req",req.body.tournamentName);
    games.addGames(req.body).then(data=>{
        //console.log("huihu",data);
        if(data){
                res.send(data);
            }
    }).catch(err=>{
        throw err;
    })
});
routing.get('/getGames/:gameName/:page',(req,res,next)=>{
   //console.log("gameName",req.params.gameName);
    //let n=parseInt
    games.getGamesonNames(req.params.gameName,parseInt(req.params.page)).then(data=>{
        if(data){
            res.send(data);
        }
    }).catch(err=>{
        throw err;
    })
})
///bookTournaments/PUBG/PUBG1
routing.get('/bookTournaments/:gameName/:tournamentName',(req,res,next)=>{
    //console.log(req.params.gameName, req.params.tournamentName);
    games.bookTournaments(req.params.gameName,req.params.tournamentName).then(data=>{
        if(data){
            res.send(data);
        }
    }).catch(err=>{
        throw err;
    })
    
})

module.exports=routing;