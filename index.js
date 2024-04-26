import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import UserRoute from "./routes/user.js"
import doctorRoute from "./routes/doctor.js"
import reviewRoute from './routes/review.js'
import bookingRoute from  './routes/booking.js'

dotenv.config() 

const app=express()
const port=process.env.PORT ||8000

//configureing cors 
const corsOptions={
    orgin:true
    //origin:true allows in domain to excess the servers disuses
    //which is helpful to read development in a production  apllication
    // you dont want to restrict the allowed origin mods strictly
}

//database connextion
//query-strict-false  want the console
mongoose.set('strictQuery',false);
mongoose.set('strictQuery',false);
const connectDb=async()=> {
    try{
        
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        })
        console.log('Mongodb conneced')
    } catch(err)
    {
        console.log('Mongodb error')
    }
}

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth',authRoute)//domain/api/v1/auth/register
app.use('/api/v1/users',UserRoute);
app.use('/api/v1/doctors',doctorRoute);
app.use('/api/v1/reviews',reviewRoute);
app.use('/api/v1/bookings',bookingRoute);



app.get('/',(req,res)=>
{
    res.send("api is working")
})


app.listen(port,()=>
{
    connectDb();
   console.log("server is running on port"+port); 
})