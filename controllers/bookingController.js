import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'
import BookingSchema from '../models/BookingSchema.js'

export const getCheckoutSession = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId)
        // console.log(doctor)
        const user = await User.findById(req.userId)
        // if (!doctor) {
        //     throw new Error('Doctor not found');
        // }
        // if (!user) {
        //     throw new Error('User not found');
        // }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        // console.log(stripe)
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,

            customer_email:user.email,
            client_reference_id: req.params.doctorId,
            line_items:[
                {
                    price_data: {
                        currency: 'INR',
                        unit_amount:doctor.ticketPrice*100,

                        product_data: {
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor?.photo]
                        }
                    },
                    quantity: 1
                }
            ]

        });
       
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id
        })
        await booking.save()
        res.status(200).json({succes:true,message:'Successfully paid',session})

    }
    catch (err) {

        res.status(500).json({succes:false,message:' Error creating checkout session '});
    }
}

BookingSchema.prependListener(/^find/,function(next){
    this.populate('user').populate({
        path:'doctor',
        select :'name'
    });
    next();
});


// export default mongoose.model('Booking',BookingSchema);