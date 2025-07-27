const User = require("../model/user.model") || require("../model/user.model");
const { generateToken } = require("../utils/jwt.security")
const xss = require("xss");

const signup = async (req, res) => {
    try {
        const user = new User(req.body);
    
        //input sanitization to prevent XSS attacks
        user.name = xss(user.name);
        user.email = xss(user.email);
        user.address.line1 = xss(user.address.line1);
        user.address.line2 = xss(user.address.line2);
        user.address.city = xss(user.address.city);
        user.address.state = xss(user.address.state);
        user.address.zipCode = xss(user.address.zipCode);
        user.address.country = xss(user.address.country);
        user.contact = xss(user.contact);
        user.password = xss(user.password);



        await user.save();
        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                password:user.password
            }
        });
    } catch (err) {
        // Handle duplicate email error
      console.error("Error in POST /signup:", err.message);
        res.status(500).send(err.message);
    }
};

const login = async (req, res)=>{
    try{
        let {email, password} = req.body;

        email = xss(email);
        password = xss(password);


        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }

        if(!await user.comparePassword(password)){
            return res.status(401).json({
                success:false,
                message: "Invalid password"
            })
        }

        //generate a JWT token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token:token
        })

    }
    catch(err){
        console.error("Error in POST /login:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const logout = (req, res)=>{
    try{
        // Logic for logout (e.g., clearing session or token)
        
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    }
    catch(err){
        
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const profile = async (req, res) =>{
    try{
        const userId = req.params.id;
        const user= await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }


        res.status(200).json({
            success:true,
            data:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                phone: user.phone,
            }
        })
    }
    catch(err){
        // console.error("Error in GET /profile:", err.message);
        res.status(500).send(err.message || "Internal Server Error");
    }
}

const updatePassword = async (req, res)=>{
    try{
        //identify which user is updating the password
        const userId = req.params.id;
        //old password and new password from request body
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);


        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(user.password !== oldPassword){
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch(err){
        res.status(500).send(err.message || "Internal Server Error");
    }
}

module.exports = {
    signup,
    login,
    logout,
    profile,
    updatePassword
}
