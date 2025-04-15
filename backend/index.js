import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from 'path';
import { fileURLToPath } from 'url';
import storyRoutes from './src/routes/storyRoutes.js';
import contributionRoutes from './src/routes/contributionRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import mongoose from "mongoose";

dotenv.config();


const app=express();

const corsOptions={
    origin:true
}

const port=process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/stories', storyRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', userRoutes);


const connectDB=async ()=>{
    
await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));
}


app.listen(port,()=>{
    connectDB();

    console.log("server started")
})