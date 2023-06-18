const express = require('express');
const mongoose = require('mongoose');
const User = require('./shema/userSchema');
const Image = require('./shema/imageSchema');
const path = require('path');
const multer = require('multer');
const cors = require('cors');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'uploads','images')));
app.use(cors());







mongoose
  .connect('mongodb+srv://yakoubi:raouliheb123@test.78bfzda.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Failed to connect to the database', err);
  });





const storage = multer.diskStorage({
  destination: 'uploads/images',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});



const uploads = multer({ storage });





app.post('/images', uploads.single('image'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imagePath = req.file.path;

    const image = new Image({ imagePath, user: userId });

    await image.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (err) {
    console.error('Error uploading image', err);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});


app.post('/UserImages', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body);
    console.log(userId);
    const images = await Image.find({ user: userId });
    console.log(images);
    images.map((image) => {
      image.imagePath = "http://localhost:3001/" + image.imagePath;
      image.imagePath = image.imagePath.replace("/uploads", "");
    });

    res.json(images);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the images' });
  }
});





app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
