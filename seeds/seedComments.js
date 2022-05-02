if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { firstWord, thirdWord, secondWord } = require('./seedHelpers');
const Post = require('../models/post.schema');
const User = require('../models/user.schema');
const Comment = require('../models/comment.schema')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/azores';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    const post = await Post.findOne({ URLid: '9p8E0x', titleURL: 'A_right_week' });
    const user = await User.findOne({ username: 'test' });
    post.comments = [];
    await Comment.deleteMany({});
    console.time('seeding');
    for (let i = 0; i < 500; i++) {
        const comment = new Comment({
            body: `${sample(firstWord)} ${sample(secondWord)} ${sample(thirdWord)}`,
            post: post._id,
            author: user._id,
        });
        post.comments.push(comment);
        user.comments.push(comment);
        await post.save();
        await user.save();
        await comment.save();
        process.stdout.write("\r" + i);
    }
    console.log("\r" + "Seeding complete");
    console.timeEnd('seeding');
}

seedDB().then(() => {
    mongoose.connection.close();
})