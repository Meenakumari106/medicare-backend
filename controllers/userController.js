import User from "../models/UserSchema.js";
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'


export const updateUser = async (req, res) => {
    const id = req.params.id
    try {
        const updatedUser = await User.findByIdAndUpdate
            (
                id,
                { $set: req.body },
                { new: true }
            );
        res.status(200)
            .json(
                {
                    success: true,
                    message: 'Successfully updated',
                    data: updatedUser
                });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update' })

    }
}


export const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        await User.findByIdAndDelete
            (
                id,

            );
        res.status(200)
            .json(
                {
                    success: true,
                    message: 'Successfully deleted',
                });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete' })

    }
}

export const getsingleUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id).select("-password")

        res.status(200)
            .json(
                {
                    success: true,
                    message: 'user found',
                    data: user
                }
            );

    } catch (err) {
        res.status(404).json({ success: false, message: 'no user found' })

    }
}

export const getallUser = async (req, res) => {

    try {
        const users = await User.find({}).select("-password");
        res.status(200)
            .json(
                {
                    success: true,
                    message: 'users found',
                    data: users
                }
            );

    } catch (err) {
        console.log("this is it")
        res.status(404).json({ success: false, message: ' not found' })

    }
}





export const getUserProfile = async (req, res) => {
    const userId = req.userId
    // console.log(userId)

    try {
        const user = await User.findById(userId)
        // console.log(user)

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }

        const {password, ...rest} = user._doc
       
        res.status(200).json({ success: true, message: 'Profile info is getting', data: { ...rest } })

    } catch (err) {
        res.status(500).json({ success: false, message: 'something went wrong,cannot get' })
             
    }
};


export const getMyAppointments = async(req,res) => {
    try{
        //step-1 :retrieve appointments from booking
        

        const bookings =await Booking.find({user:req.userId})
        
    //    console.log(bookings)
        //step-2 extract doctor from appointment bookings
 
          const doctorIds =bookings.map(el => el.doctor._id )
        //   console.log(doctorIds)
        //step-3 :retrive doctors using doctor ids
            
        const doctors =await Doctor.find({_id:{$in:doctorIds}}).select('-password')

        res.status(200).json({success:true,message:"Appointment are getting",data:doctors})


    }catch(err)
    {
        res.status(500).json({success:false,message:"Something went Wrong,cannot get it from here"})
 
    }
};