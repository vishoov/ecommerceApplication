const Product = require('../model/product.model'); // Assuming you have a Product model defined
const xss = require('xss'); 


const createProduct = async (req, res)=>{
    try{
        
// 	id:string,
// 	Name:string,
// description:string,
// Costprice:number,
// saleprice:number,
// Category:string,
// Stock:number,
// image:[String] 

        let { name, description, costPrice, salePrice, category, stock, image } = req.body;

        name = xss(name);
        description = xss(description);
        category = xss(category);
        // image= image.map(img => xss(img));

        const newProduct = new Product({
            name, 
            description,
            costPrice,
            salePrice, 
            category, 
            stock, 
            image

        })


        await newProduct.save();


        if(!newProduct){
            return res.status(400).json({message: "Product creation failed"});
        }

        res.status(201).json({message: "Product created successfully", product: newProduct});
    }
    catch(err){
        res.status(500).json({message: err.message || "Internal Server Error"});
    }   
}


 const getProductById  = async (req, res)=>{
    try{
        const id = req.params.id;

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200)
        .json({
            message: "Product fetched successfully",
            product: product
        })
    }
    catch(err){
        res.status(500).json({message: err.message || "Internal Server Error"});
    }
 }

const updateProduct = async (req, res)=>{
    try{
        const id = req.params.id;

        const { name, description, costPrice, salePrice, category, stock, image } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name: xss(name),
            description: xss(description),
            costPrice,
            salePrice,
            category: xss(category),
            stock,
            image // Assuming image is an array of strings
        }, { new: true });

        if(!updatedProduct){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        })
        
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const deleteProduct = async (req, res)=>{
    try{
        const id = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        })
    }
    catch(err){
        res.status(500).json({message:err.message|| "Internal Server Error"});
    }
} 


const searchProduct = async (req, res)=>{
    try{
        const { query } = req.query;

        //if there is no query provided we'll return all products

        if(!query){
            const allProducts = await Product.find({});
            return res.status(200).json({
                message:"All products fetched successfully",
                products: allProducts
            })
        }

        //now if the query is provided, we'll search for products that match the query in name or description

        const searchResults = await Product.find({
            $or:[
                {name: {$regex:query, $options:'i'}}, // 'i' for case-insensitive search
                {description: {$regex:query, $options:'i'}}
            ]
        })

        if(searchResults.length==0){
            return res.status(404).json({message: "No products found matching the search criteria"});
        }

        res.status(200).json({
            message:"Search results fetched successfully",
            products: searchResults 
        })
        
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProduct
}