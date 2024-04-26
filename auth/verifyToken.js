import jwt from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


export const authenicate = async (req, res, next) => {
    //retrieve token from autherization headers

    const authToken = req.headers.authorization
    //    console.log(req)
    //we except token in the formm 'Bearer' actual token
    //check if token exist or not
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: "no token bearer,authorization denied " })
    }


    try {
        // console.log(authToken);
        const token = authToken.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.userId=decoded.id
        req.role=decoded.role
        next();//must be call the next func
    } catch (err) {
        if(err.name=='TokenExpiredError')  
        {
            return res.status(401).json({message:"Token is experied"});
        }
        return res.status(401).json({success:false,message:"Invalid token"});
     }

};

export const restrict = roles => async(req,res,next)=>
{
    const userId=req.userId
///console.log(req)
    let user;
    
    const patient=await User.findById(userId)
    const doctor=await Doctor.findById(userId)

    if(patient)
    {
        user=patient;
    }
    if(doctor)
    {
        user=doctor;
    }
    //  console.log(user)
    if(!roles.includes(user?.role))
    {
        return res.status(401).json({success:false,message:"User not authorized"})
    }
    next();
}