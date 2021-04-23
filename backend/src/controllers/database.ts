import { ConnectionOptions, connect } from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI: string =
            "mongodb://localhost:27017/semesta-kartini?redPreference=primary&appname=MongoDB%20Compass&ssl=false";
        const options: ConnectionOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        };
        await connect(mongoURI, options);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        console.log("MongoDB: Attempting to reconnect");
        setTimeout(connectDB, 5000);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
