const mongoose = require('mongoose');
const Community = require('../models/community.schema');

mongoose.connect('mongodb://localhost:27017/azores', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async() => {
    await Community.deleteMany({});
    const comm = new Community({
        name: 'TestCommunity',
        creator: 'TestUser',
    });
    await comm.save();
}

seedDB().then(() => {
    mongoose.connection.close();
})