import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js"




export const updateDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate
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
                    data: updateDoctor
                });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update' })

    }
}


export const deleteDoctor = async (req, res) => {
    const id = req.params.id
    try {
        await Doctor.findByIdAndDelete
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

export const getsingleDoctor = async (req, res) => {
    const id = req.params.id
    // console.log(id)
    try {
        const doctor = await Doctor.findById(id).populate('reviews').select("-password")
       
        // console.log(doctor)

        res.status(200)
            .json(
                {
                    success: true,
                    message: 'doctor found',
                    data: doctor
                }
            );

    } catch (err) {
        res.status(404).json({ success: false, message: 'no doctor found' })

    }
}

export const getallDoctor = async (req, res) => {

    try {

        const { query } = req.query;
        let doctors;
        if (query) {
            doctors = await Doctor.find({
                isApproved: "approved",
                $or:
                    [
                        { name: { $regex: query, $options: "i" } },
                        { specialization: { $regex: query, $options: "i" } }
                    ],
            }).select("-password");
           

        }


        else {
            doctors = await Doctor.find({isApproved: "approved"}).select("-password");
            // console.log(doctors)
        } 
        res.status(200)
            .json(
                {
                    success: true,
                    message: 'doctors found',
                    data:doctors
                }
            );

    } catch (err) {
        res.status(404).json({ success: false, message: ' not found' })

    }
}

export const getDoctorProfile =async(req,res)=>{
    const doctorId = req.userId
    //console.log(doctorId)
    try {
        const doctor = await Doctor.findById(doctorId)
       // console.log(doctor)
        if (!doctor) {
            return res.status(404).json({ success: false, message: "doctor not found" })
        }

        const {password, ...rest} = doctor._doc
        const appointments=await Booking.find({doctor:doctorId})

        res.status(200).json({ success: true, message: 'Profile info is getting', data: { ...rest,appointments } })

    } catch (err) {
        res.status(500).json({ success: false, message: 'something went wrong,cannot get' })
             
    }
}

