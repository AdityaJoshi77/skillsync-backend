const mongoose = require('mongoose');

const skillDataSchema = new mongoose.Schema({
    skillId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    skillTitle:{
        type:String,
        required:true
    },
    progress:{
        type:Number,
        required:true,
    },
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    skillMetaData:{
        type:[skillDataSchema],
        default:[]
    }    
},{timestamps:true});

module.exports =  mongoose.model('User', userSchema);