require('../model/database');
const Category = require('../model/Category');
const design = require('../model/design');
const Contact = require('../model/Contact');

/**
 * GET /
 * Homepage 
*/

exports.homepage = async(req,res)=>{




    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await design.find({}).sort({_id:-1}).limit(limitNumber);
        const mangalsutra = await design.find({ 'category':'Mangalsutra'}).limit(limitNumber);
        const SilverPayal = await design.find({ 'category':'Silver Payal'}).limit(limitNumber);
        const couplerings = await design.find({ 'category':'Couple Rings'}).limit(limitNumber);
        const bracelets = await design.find  ({'category':'Silver Bracelets'}).limit(limitNumber);
        const nacklace = await design.find  ({'category':'Necklaces'}).limit(limitNumber);
        

        const gold = { latest , mangalsutra, SilverPayal,couplerings,bracelets,nacklace  };
        res.render('index',{ title:'Maa Jewellers - Home',categories,gold});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"});
        
    }
}  
/**
 * GET / categories
 * categories
*/

exports.exploreCategories = async(req,res)=>{

    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber)
        res.render('categories',{ title:'Maa Jewellers - categories',categories});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"});
        
    }
}
/**
 * GET / categories/:id
 * categoriesById
*/

exports.exploreCategoriesById = async(req,res)=>{

    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await design.find({ 'category':categoryId}).limit(limitNumber)
        res.render('categories',{ title:'Maa Jewellers - categories',categoryById});
    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"});
        
    }
}
/**
 * GET /design/:id
 * Design
*/

exports.exploreDesign = async (req, res) => {
    try {
        let designId = req.params.id;
        const designs = await design.findById(designId);
        res.render('design', { title: 'MAA Jewellers - Design', designs });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};



/**
 * POST /search
 * Search 
*/
exports.searchDesign = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let designs = await design.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'MAA Jewellers - Search', designs } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }
  


    
 /**
 * GET /explore-latest
 * Explore Latest 
*/

exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 15;
        const designs = await design.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'MAA Jewellers - Explore-Latest', designs });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};






 /**
 * GET /exploreRandom 
 * exploreRandom 
*/

exports.exploreRandom  = async (req, res) => {
    try {
        let count = await design.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let designs = await design.findOne().skip(random).exec();
        res.render('explore-random', { title: 'MAA Jewellers - Explore-Random', designs });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occurred" });
    }
};




/**
 * GET /submitDesign
 * submitDesign
*/

exports.submitDesign  = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-design', { title: 'MAA Jewellers - Submit Design',infoErrorsObj,infoSubmitObj});

}




/**
 * POST /submitDesignOnPost
 * submitDesignOnPost
*/

exports.submitDesignOnPost  = async (req, res) => {
   
    try {
        let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newdesign = new design({
      name: req.body.name,
      weight: req.body.weight,
      email: req.body.email,
      material: req.body.materials,
      category: req.body.category,
      image: newImageName
    });
    
    await newdesign.save();

    req.flash('infoSubmit', 'Design Has Been Added.')
    res.redirect('/submit-design');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-design');
  }
}


/**
 * get/about page 
 * about page 
*/
// designController.js

exports.aboutPage = (req, res) => {
    res.render('about', { title: 'About MAA Jewellers' });
};


/**
 * get/contact page 
 * contact page 
*/
exports.contactPage = (req, res) => {
    res.render('contact', { title: 'About MAA Jewellers' });
};

exports.sendContactMessage = async (req, res) => {
    try {
      const { name, email, mobile, message,requirement } = req.body;
      const newSubmission = new Contact({
        name,
        email,
        mobile,
        message,
        requirement
      });
      
      await newSubmission.save();
      return res.render('submit-contact',{title: "MAA jewellers: Contact"})
    } catch (err) {
      console.error('Error submitting form:', err);
      res.status(500).send('Error submitting form');
    }
  };






// delete design
// async function deletedesign(){
//   try {
//     await Recipe.deleteOne({ name: 'ring' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deletedesign();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();






// async function insertDummyDesignData(){
//     try {
//         await design.insertMany(        [
//             {
//             "_id": { "$oid": "614dd8d3c59f69c8ebcc18a6" },
//             "object_id": "jewelry128",
//             "name": "Silver Link Bracelet",
//             "weight": "10 grams",
//             "email": "hello@email.com",
//             "material": ["Silver"],
//             "category": "Silver Bracelets",
//             "image": "bracelet5.jpg"
//             },
//             {
//             "_id": { "$oid": "614dd8d3c59f69c8ebcc18a7" },
//             "object_id": "jewelry129",
//             "name": "Sterling Silver Cuff",
//             "weight": "15 grams",
//             "email": "hello@email.com",
//             "material": ["Sterling Silver"],
//             "category": "Silver Bracelets",
//             "image": "bracelet4.jpg"
//             },
//             {
//             "_id": { "$oid": "614dd8d3c59f69c8ebcc18a8" },
//             "object_id": "jewelry130",
//             "name": "Silver Bangle Set",
//             "weight": "20 grams",
//             "email": "hello@email.com",
//             "material": ["Silver"],
//             "category": "Silver Bracelets",
//             "image": "bracelet3.jpg"
//             },
//             {
//             "_id": { "$oid": "614dd8d3c59f69c8ebcc18a9" },
//             "object_id": "jewelry131",
//             "name": "925 Silver Tennis Bracelet",
//             "weight": "12 grams",
//             "email": "hello@email.com",
//             "material": ["925 Silver"],
//             "category": "Silver Bracelets",
//             "image": "bracelet2.jpg"
//             },
//             {
//             "_id": { "$oid": "614dd8d3c59f69c8ebcc18aa" },
//             "object_id": "jewelry132",
//             "name": "Chunky Silver Chain Bracelet",
//             "weight": "18 grams",
//             "email": "hello@email.com",
//             "material": ["Silver"],
//             "category": "Silver Bracelets",
//             "image": "bracelet1.jpg"
//             },

            
//                 {
//                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18ba" },
//                 "object_id": "jewelry148",
//                 "name": "Traditional Silver Payal",
//                 "weight": "50 grams",
//                 "email": "hello@email.com",
//                 "material": ["Silver"],
//                 "category": "Silver Payal",
//                 "image": "payal1.jpg"
//                 },
//                 {
//                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18bb" },
//                 "object_id": "jewelry149",
//                 "name": "Oxidized Silver Anklets",
//                 "weight": "40 grams",
//                 "email": "hello@email.com",
//                 "material": ["Oxidized Silver"],
//                 "category": "Silver Payal",
//                 "image": "payal2.jpg"
//                 },
//                 {
//                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18bc" },
//                 "object_id": "jewelry150",
//                 "name": "Silver Ghungroo Payal",
//                 "weight": "35 grams",
//                 "email": "hello@email.com",
//                 "material": ["Silver"],
//                 "category": "Silver Payal",
//                 "image": "payal3.jpg"
//                 },
//                 {
//                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18bd" },
//                 "object_id": "jewelry151",
//                 "name": "Designer Silver Payal",
//                 "weight": "45 grams",
//                 "email": "hello@email.com",
//                 "material": ["Silver"],
//                 "category": "Silver Payal",
//                 "image": "payal4.jpg"
//                 },
//                 {
//                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18be" },
//                 "object_id": "jewelry152",
//                 "name": "Silver Filigree Anklets",
//                 "weight": "30 grams",
//                 "email": "hello@email.com",
//                 "material": ["Silver"],
//                 "category": "Silver Payal",
//                 "image": "payal5.jpg"
//                 },
                
//                     {
//                       "_id": { "$oid": "614dd8d3c59f69c8ebcc18b5" },
//                       "object_id": "jewelry143",
//                       "name": "Gold Matching Couple Rings",
//                       "weight": "10 grams",
//                       "email": "hello@email.com",
//                       "material": ["Gold"],
//                       "category": "Couple Rings",
//                       "image": "couplering1.jpg"
//                     },
//                     {
//                       "_id": { "$oid": "614dd8d3c59f69c8ebcc18b6" },
//                       "object_id": "jewelry144",
//                       "name": "Silver Love Bands",
//                       "weight": "8 grams",
//                       "email": "hello@email.com",
//                       "material": ["Silver"],
//                       "category": "Couple Rings",
//                       "image": "couplering2.jpg"
//                     },
//                     {
//                       "_id": { "$oid": "614dd8d3c59f69c8ebcc18b7" },
//                       "object_id": "jewelry145",
//                       "name": "Diamond Engagement Rings",
//                       "weight": "15 grams",
//                       "email": "hello@email.com",
//                       "material": ["Diamond"],
//                       "category": "Couple Rings",
//                       "image": "couplering3.jpg"
//                     },
//                     {
//                       "_id": { "$oid": "614dd8d3c59f69c8ebcc18b8" },
//                       "object_id": "jewelry146",
//                       "name": "Platinum Wedding Bands",
//                       "weight": "20 grams",
//                       "email": "hello@email.com",
//                       "material": ["Platinum"],
//                       "category": "Couple Rings",
//                       "image": "couplering4.jpg"
//                     },
//                     {
//                       "_id": { "$oid": "614dd8d3c59f69c8ebcc18b9" },
//                       "object_id": "jewelry147",
//                       "name": "Rose Gold Promise Rings",
//                       "weight": "12 grams",
//                       "email": "hello@email.com",
//                       "material": ["Rose Gold"],
//                       "category": "Couple Rings",
//                       "image": "couplering5.jpg"
//                     },

                    
//                         {
//                           "_id": { "$oid": "614dd8d3c59f69c8ebcc18b0" },
//                           "object_id": "jewelry138",
//                           "name": "Gold Black Bead Mangalsutra",
//                           "weight": "15 grams",
//                           "email": "hello@email.com",
//                           "material": ["Gold", "Black Beads"],
//                           "category": "Mangalsutra",
//                           "image": "mangalsutra1.jpg"
//                         },
//                         {
//                           "_id": { "$oid": "614dd8d3c59f69c8ebcc18b1" },
//                           "object_id": "jewelry139",
//                           "name": "Diamond Mangalsutra Pendant",
//                           "weight": "10 grams",
//                           "email": "hello@email.com",
//                           "material": ["Diamond"],
//                           "category": "Mangalsutra",
//                           "image": "mangalsutra2.jpg"
//                         },
//                         {
//                           "_id": { "$oid": "614dd8d3c59f69c8ebcc18b2" },
//                           "object_id": "jewelry140",
//                           "name": "Traditional Gold Mangalsutra",
//                           "weight": "18 grams",
//                           "email": "hello@email.com",
//                           "material": ["Gold"],
//                           "category": "Mangalsutra",
//                           "image": "mangalsutra3.jpg"
//                         },
//                         {
//                           "_id": { "$oid": "614dd8d3c59f69c8ebcc18b3" },
//                           "object_id": "jewelry141",
//                           "name": "Diamond Solitaire Mangalsutra",
//                           "weight": "12 grams",
//                           "email": "hello@email.com",
//                           "material": ["Gold", "Diamond"],
//                           "category": "Mangalsutra",
//                           "image": "mangalsutra4.jpg"
//                         },
//                         {
//                           "_id": { "$oid": "614dd8d3c59f69c8ebcc18b4" },
//                           "object_id": "jewelry142",
//                           "name": "Temple Design Mangalsutra",
//                           "weight": "20 grams",
//                           "email": "hello@email.com",
//                           "material": ["Gold"],
//                           "category": "Mangalsutra",
//                           "image": "mangalsutra5.jpg"
//                         },

                        
//                             {
//                               "_id": { "$oid": "614dd8d3c59f69c8ebcc18ab" },
//                               "object_id": "jewelry133",
//                               "name": "24K Gold Rope Chain",
//                               "weight": "25 grams",
//                               "email": "hello@email.com",
//                               "material": ["24K Gold"],
//                               "category": "Gold Chains",
//                               "image": "chain 1.jpg"
//                             },
//                             {
//                               "_id": { "$oid": "614dd8d3c59f69c8ebcc18ac" },
//                               "object_id": "jewelry134",
//                               "name": "Yellow Gold Figaro Necklace",
//                               "weight": "30 grams",
//                               "email": "hello@email.com",
//                               "material": ["Yellow Gold"],
//                               "category": "Gold Chains",
//                               "image": "chain2.jpg"
//                             },
//                             {
//                               "_id": { "$oid": "614dd8d3c59f69c8ebcc18ad" },
//                               "object_id": "jewelry135",
//                               "name": "Rose Gold Cuban Link Chain",
//                               "weight": "28 grams",
//                               "email": "hello@email.com",
//                               "material": ["Rose Gold"],
//                               "category": "Gold Chains",
//                               "image": "chain 3.jpg"
//                             },
//                             {
//                               "_id": { "$oid": "614dd8d3c59f69c8ebcc18ae" },
//                               "object_id": "jewelry136",
//                               "name": "White Gold Box Chain",
//                               "weight": "22 grams",
//                               "email": "hello@email.com",
//                               "material": ["White Gold"],
//                               "category": "Gold Chains",
//                               "image": "chain4.jpg"
//                             },
//                             {
//                               "_id": { "$oid": "614dd8d3c59f69c8ebcc18af" },
//                               "object_id": "jewelry137",
//                               "name": "18K Gold Singapore Chain",
//                               "weight": "18 grams",
//                               "email": "hello@email.com",
//                               "material": ["18K Gold"],
//                               "category": "Gold Chains",
//                               "image": "chain 5."
//                             },
//                             {
//                                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18bf" },
//                                 "object_id": "jewelry153",
//                                 "name": "Diamond Pendant Necklace",
//                                 "weight": "8 grams",
//                                 "email": "hello@email.com",
//                                 "material": ["Diamond", "Gold"],
//                                 "category": "Necklaces",
//                                 "image": "nacklace1.jpg"
//                               },
//                               {
//                                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18c0" },
//                                 "object_id": "jewelry154",
//                                 "name": "Gold Chain Necklace",
//                                 "weight": "10 grams",
//                                 "email": "hello@email.com",
//                                 "material": ["Gold"],
//                                 "category": "Necklaces",
//                                 "image": "nacklace2.jpg"
//                               },
//                               {
//                                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18c1" },
//                                 "object_id": "jewelry155",
//                                 "name": "Silver Heart Locket",
//                                 "weight": "5 grams",
//                                 "email": "hello@email.com",
//                                 "material": ["Silver"],
//                                 "category": "Necklaces",
//                                 "image": "nacklace3.jpg"
//                               },
//                               {
//                                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18c2" },
//                                 "object_id": "jewelry156",
//                                 "name": "Pearl Strand Necklace",
//                                 "weight": "15 grams",
//                                 "email": "hello@email.com",
//                                 "material": ["Pearl", "Silver"],
//                                 "category": "Necklaces",
//                                 "image": "nacklace4.jpg"
//                               },
//                               {
//                                 "_id": { "$oid": "614dd8d3c59f69c8ebcc18c3" },
//                                 "object_id": "jewelry157",
//                                 "name": "Ruby Pendant Necklace",
//                                 "weight": "12 grams",
//                                 "email": "hello@email.com",
//                                 "material": ["Ruby", "Gold"],
//                                 "category": "Necklaces",
//                                 "image": "nacklace5.jpg"
//                               }
//                           ]
                          
                      
                      
                  
                  
            
            

//           );
                        
//     } catch (error) {
//         console.log('err',+ error)
//     }
// }

// insertDummyDesignData();





// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany(
//             {
//             "name": "Gold Nacklace",
//             "image": "gold nacklace.jpg"
//           },
//           {
//             "name": "Mangalsutra",
//             "image": "mangalsutra.jpg"
//           }, 
//           {
//             "name": "Silver Payal",
//             "image": "silver payal.jpg"
//           },
//           {
//             "name": "Gold Chains",
//             "image": "gold chains.jpg"
//           }, 
//           {
//             "name": "Couple Rings",
//             "image": "Couple rings.jpg"
//           },
//           {
//             "name": "Silver Bracelets",
//             "image": "silver bracelets.jpg"
//           }
//         ]);
                        
//     } catch (error) {
//         console.log('err',+ error)
//     }
// }

// insertDummyCategoryData();



// [
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18a6"
//       },
//       "object_id": "jewelry128",
//       "name": "Silver Bracelet 1",
//       "weight": "7 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["Bracelets"],
//       "image": "silver-bracelet-1.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18a7"
//       },
//       "object_id": "jewelry129",
//       "name": "Gold Chain 1",
//       "weight": "12 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Gold Chains"],
//       "image": "gold-chain-1.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18a8"
//       },
//       "object_id": "jewelry130",
//       "name": "Mangalsutra 1",
//       "weight": "9 grams",
//       "email": "hello@email.com",
//       "material": ["Gold", "Black Beads"],
//       "category": ["Mangalsutra"],
//       "image": "mangalsutra-1.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18a9"
//       },
//       "object_id": "jewelry131",
//       "name": "Couple Rings 1",
//       "weight": "6 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Couple Rings"],
//       "image": "couple-rings-1.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18aa"
//       },
//       "object_id": "jewelry132",
//       "name": "Silver Payal 1",
//       "weight": "50 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["SilverPayal"],
//       "image": "silver-payal-1.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18ab"
//       },
//       "object_id": "jewelry133",
//       "name": "Silver Bracelet 2",
//       "weight": "8 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["Bracelets"],
//       "image": "silver-bracelet-2.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18ac"
//       },
//       "object_id": "jewelry134",
//       "name": "Gold Chain 2",
//       "weight": "18 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Gold Chains"],
//       "image": "gold-chain-2.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18ad"
//       },
//       "object_id": "jewelry135",
//       "name": "Mangalsutra 2",
//       "weight": "11 grams",
//       "email": "hello@email.com",
//       "material": ["Gold", "Black Beads"],
//       "category": ["Mangalsutra"],
//       "image": "mangalsutra-2.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18ae"
//       },
//       "object_id": "jewelry136",
//       "name": "Couple Rings 2",
//       "weight": "7 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Couple Rings"],
//       "image": "couple-rings-2.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18af"
//       },
//       "object_id": "jewelry137",
//       "name": "Silver Payal 2",
//       "weight": "55 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["SilverPayal"],
//       "image": "silver-payal-2.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b0"
//       },
//       "object_id": "jewelry138",
//       "name": "Silver Bracelet 3",
//       "weight": "6.5 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["Bracelets"],
//       "image": "silver-bracelet-3.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b1"
//       },
//       "object_id": "jewelry139",
//       "name": "Gold Chain 3",
//       "weight": "22 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Gold Chains"],
//       "image": "gold-chain-3.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b2"
//       },
//       "object_id": "jewelry140",
//       "name": "Mangalsutra 3",
//       "weight": "13 grams",
//       "email": "hello@email.com",
//       "material": ["Gold", "Black Beads"],
//       "category": ["Mangalsutra"],
//       "image": "mangalsutra-3.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b3"
//       },
//       "object_id": "jewelry141",
//       "name": "Couple Rings 3",
//       "weight": "8 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Couple Rings"],
//       "image": "couple-rings-3.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b4"
//       },
//       "object_id": "jewelry142",
//       "name": "Silver Payal 3",
//       "weight": "60 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["SilverPayal"],
//       "image": "silver-payal-3.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b5"
//       },
//       "object_id": "jewelry143",
//       "name": "Silver Bracelet 4",
//       "weight": "7.2 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["Bracelets"],
//       "image": "silver-bracelet-4.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b6"
//       },
//       "object_id": "jewelry144",
//       "name": "Gold Chain 4",
//       "weight": "24 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Gold Chains"],
//       "image": "gold-chain-4.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b7"
//       },
//       "object_id": "jewelry145",
//       "name": "Mangalsutra 4",
//       "weight": "14 grams",
//       "email": "hello@email.com",
//       "material": ["Gold", "Black Beads"],
//       "category": ["Mangalsutra"],
//       "image": "mangalsutra-4.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b8"
//       },
//       "object_id": "jewelry146",
//       "name": "Couple Rings 4",
//       "weight": "7.5 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Couple Rings"],
//       "image": "couple-rings-4.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18b9"
//       },
//       "object_id": "jewelry147",
//       "name": "Silver Payal 4",
//       "weight": "65 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["SilverPayal"],
//       "image": "silver-payal-4.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18ba"
//       },
//       "object_id": "jewelry148",
//       "name": "Silver Bracelet 5",
//       "weight": "6.8 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["Bracelets"],
//       "image": "silver-bracelet-5.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18bb"
//       },
//       "object_id": "jewelry149",
//       "name": "Gold Chain 5",
//       "weight": "26 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Gold Chains"],
//       "image": "gold-chain-5.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18bc"
//       },
//       "object_id": "jewelry150",
//       "name": "Mangalsutra 5",
//       "weight": "15 grams",
//       "email": "hello@email.com",
//       "material": ["Gold", "Black Beads"],
//       "category": ["Mangalsutra"],
//       "image": "mangalsutra-5.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18bd"
//       },
//       "object_id": "jewelry151",
//       "name": "Couple Rings 5",
//       "weight": "8 grams",
//       "email": "hello@email.com",
//       "material": ["Gold"],
//       "category": ["Couple Rings"],
//       "image": "couple-rings-5.jpg"
//     },
//     {
//       "_id": {
//         "$oid": "614dd8d3c59f69c8ebcc18be"
//       },
//       "object_id": "jewelry152",
//       "name": "Silver Payal 5",
//       "weight": "70 grams",
//       "email": "hello@email.com",
//       "material": ["Silver"],
//       "category": ["SilverPayal"],
//       "image": "silver-payal-5.jpg"
//     }
//   ]
  