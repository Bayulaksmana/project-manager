import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    try {
        const connect = await mongoose.connect(uri);
        console.log(`Connected In Database Success ✅ 
Database: ${connect.connection.name} - Port: ${connect.connection.port}
Hostname: ${connect.connection.host}`);
    } catch (err) {
        console.error("❌ Periksa pengaturan database -> config -> db connection:", err.message);
    }
};
export default connectDB;