const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
name:{
    type:String,
    required :'This Field Is Required.'
},
weight:{
    type:String,
    required :'This Field Is Required.'
},
email:{
    type:String,
    required :'This Field Is Required.'
},
material :{
    type:Array,
    required :'This Field Is Required.'
},
category: {
    type: String,
    enum: ['Silver Bracelates', 'Chains', 'Mangalsutra', 'Couple Rings', 'SilverPayal','Nacklace'],
    required: 'This Field Is Required.'
},

image :{
    type:String,
    required :'This Field Is Required.'
}


});

designSchema.index({ name:'text',material:'text'});
//wildcard indexing 

//designSchema.index({ "$**" : 'text'});


module.exports = mongoose.model('design', designSchema)