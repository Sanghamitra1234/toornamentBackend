const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const url="mongodb://localhost:27017/toornament";
// //Test
// const url="mongodb://localhost:27017/toornamentTest";

mongoose.Promise=global.Promise;

const userSchema=Schema({
    userName:String,
    password:String
},{collection : 'users',timestamps:true})

//GAmes Test
// const gamesSchema=Schema({
//     gameName:String,
//     // gameArray:[
//     //     {   
            
//             tournamentName:{type:String,required:true},
//             tournamentDesc:String,
//             registrationFees:{type:Number,required:true},
//             maxPeople:Number,
//             creatorId:String
//     //     }
//     // ]
// },{collection : 'gamesTest',timestamps:true});

const gamesSchema=Schema({
    gameName:String,
    gameArray:[
        {   
            
            tournamentName:{type:String,required:true},
            tournamentDesc:String,
            registrationFees:{type:Number,required:true},
            maxPeople:Number,
            creatorId:String
        }
    ]
},{collection : 'games',timestamps:true});

let connection={};

connection.getUsers=()=>{
    return mongoose.connect(url).then(database=>{
        return database.model('users',userSchema)
    }).catch(error=>{
        let err=new Error(error+" Could not connect to the database ");
        err.status=500;
        throw err;
    });
}

connection.getCollection=()=>{
    return mongoose.connect(url).then(database=>{
        return database.model('games',gamesSchema)
    }).catch(error=>{
        let err=new Error(error+" Could not connect to the database ");
        err.status=500;
        throw err;
    });
}

module.exports=connection;
