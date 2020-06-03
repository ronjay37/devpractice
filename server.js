const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
dotenv.config({ path: './config/config.env'})

//routes
const usersRoute = require('./routes/api/usersRoute');
const authRoute = require('./routes/api/authRoute');
const profileRoute = require('./routes/api/profileRoute');
const postsRoute = require('./routes/api/postsRoute');

const app = express();

//init middleware
app.use(express.json());

//connect to database
connectDB();

//Test the server
app.get('/', (req, res) => {
    res.send('Hello World')
})


//define route
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));