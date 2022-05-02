if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const { firstWord, thirdWord, secondWord } = require('./seedHelpers');
const Post = require('../models/post.schema');
const URLidGen = require('../utils/URLidGen');
const Community = require('../models/community.schema');
const User = require('../models/user.schema');
const { kill } = require('process');

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
    const community = await Community.findOne({ name: 'TestCommunity' }).populate('posts');
    const user = await User.findOne({ username: 'test' });
    await Post.deleteMany({});
    console.time('seeding')
    for (let i = 0; i < 500; i++) {
        const post = new Post({
            URLid: URLidGen(),
            title: `${sample(firstWord)} ${sample(secondWord)} ${sample(thirdWord)}`,
            titleURL: '',
            body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque nemo adipisci architecto, amet cumque vel. Repellat ea quas ut, odio recusandae pariatur rem tenetur iusto placeat. Quas voluptatibus enim dolore.',
            community: community._id,
            author: user._id,
        });
        post.titleURL = post.title.replaceAll(/[ ?./]/gi, '_');
        community.posts.push(post);
        user.posts.push(post);
        await post.save();
        await community.save();
        await user.save();
        process.stdout.write("\r" + i);
    }
    console.log("\r" + "Seeding complete");
    console.timeEnd('seeding');
}

seedDB().then(() => {
    mongoose.connection.close();
})