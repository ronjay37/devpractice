const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('MongoDB connected!');
    } catch (err) {
        console.error(err.message);
        //Exit process
        process.exit(1);
    }
}

module.exports = connectDB;