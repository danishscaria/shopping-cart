const { response } = require('express');
var express = require('express');
const fileupload = require('express-fileupload');
// const { render } = require('../app');
var router = express.Router();
var productHelpers=require('../helpers/producthelpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    
    
  
  res.render('admin/view-products',{admin:true,products});
});
})
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.image);

  productHelpers.addproduct(req.body,(insertedId) =>{



    let image = req.files.image

    const imageName = insertedId

    

    console.log(imageName);



    image.mv(`./public/product-images/${imageName}.jpg`,(err,done) =>{
 
  
      if(done){
        res.render("admin/view-products")
      }else
      console.log(err);
    })
    
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
 
})
router.get ('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)

  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/product-images/'+id+'.jpg')

    }
  })
})
module.exports = router;
