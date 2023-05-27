const mongoose = require('mongoose');
require('dotenv').config()
//const URI = '';
const URI = process.env.CONNECTION_STRING;

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

mongoose.connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true

})
.then(() => console.log('MongoDB connection established.'))
.catch((error) => console.error("MongoDB connection failed:", error.message))

// mongoose.connect(URI)
// .then(() => console.log('DB is UP'))
// .catch(() => console.log(err));