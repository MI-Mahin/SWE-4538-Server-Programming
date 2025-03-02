const User = require("../dataModels/User.model");
const bcrypt = require("bcrypt");

const getProfileInfos = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword, hobby, profession  } = req.body;
    console.log(newPassword)
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)



    // Update the password if provided
    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update the designation if provided
    if (hobby) {
      user.hobby = hobby;
    }


    if (profession) {
      user.profession = profession
    }

    await user.save();

    res.json({ message: 'User information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profileID = req.params.userId;
    const profileInfo = await User.findById(profileID);

    if (!profileInfo) {
      return res.status(404).json({ error: "Profile information not found" });
    }

    await profileInfo.deleteOne({ _id: profileID });

    res.json({ message: "Profile information deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
  
    console.log("profile image: "+ req.file)


    const photo = req.file.filename
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)


    if (photo) {
      user.profile_image = photo
    }
    await user.save();

    res.json({ message: 'Profile image updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleImages = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const photo = req.files.map((file) => file.filename);

    const userId = req.user.id
    const user = await User.findById(userId);
   
    if (photo) {
      user.images = photo
    }
    await user.save();

    res.json({ message: 'Multiple images updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMultipleImages = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId);
    const images= user.images

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
const audio = req.file.filename
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)


    if (audio) {
      user.audio = audio
    }
    await user.save();

    res.json({ message: 'Audio updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfileInfos,
  updateProfile,
  deleteProfile,
  postProfileImage,
  postMultipleImages,
  getMultipleImages,
  postAudioFile
};

