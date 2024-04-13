    const mongoose = require('mongoose');

    const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required :'This Field Is Required.'
    },
    image:{
        type:String,
        required :'This Field Is Required.'
    },

    });

    module.exports = mongoose.model('Category', categorySchema)