const User = require("../schemas/userSchema");
const {sendMail, generateOTP} = require("../utils/sendEmail")
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields!" });
  }

  try {
    // const returnedemail = await User.findOne({ email: email }); or the next line of code
    const returnedemail = await User.findOne({ email });
    if (returnedemail) {
      return res.status(400).json({ message: "User already exists!" });
    }

  

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (email == process.env.ADMIN_EMAIL) {
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        admin: true,
      });
      await newUser.save();
      return;
    }

    const { otp, otpExpires } = generateOTP();

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      otp,
      otpExpires, 
    });

    await newUser.save();
   

    try {
      
      const mailObj = {
        mailFrom: `Ecomapis ${process.env.EMAIL_USER}`,
        mailTo: email,
        subject: "Successfully created an account✨",
        body: `
                <h1>Welcome to Ecommapis <strong>${username}</strong> 😍</h1>
                <p>Here is your OTP <strong>${otp}</strong>, proceed to verify mail</p>
                
          `,
      };
      const info = await sendMail(mailObj);
      console.log(info);
    } catch (err) {
      console.log(err.message);
    }

    // Send email after successful registration

    res.json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.json({ errmessage: err.message });
  }
};

// Function to get all users who have been registered
const readUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(200).json({ message: "No users found!" });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

//Using a path variable to get a specific user by ID
const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(200).json({ message: "No user found!" });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

//To update a user, we use the PUT method
const editUser = async (req, res) => {
  const { id } = req.params;
  const reqId = req.user._id;
  const { username, email, password } = req.body;

  if (id === reqId) {
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.json({ message: "User updated successfully!", user });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server error!" });
    }
  }
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  const reqId = req.user._id;
  const { country, number, street, bio } = req.body;

  if (id === reqId) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            "profile.country": country,
            "profile.number": number,
            "profile.street": street,
            "profile.bio": bio,
          },
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      res.json({ message: "User updated successfully!", user });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server error!" });
    }
  }
};

//a delete method to remove a user from the database using path variable
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { _id, admin } = req.user;

  if (_id === id || admin === true) {
    try {
      await User.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully!" });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Server error!" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You are not authorized to delete this user!" });
  }
};

// Function to get products based on query parameters
const getProducts = async (req, res) => {
  const { productName, color } = req.query;
  const filter = {};
  if (productName) {
    filter.name = productName;
  }
  if (color) {
    filter.color = color;
  }

  try {
    const product = await User.find(filter);
    if (!product) {
      return res.status(404).json({ message: "No products found!" });
    }
    res.json(product);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  createUser,
  readUser,
  getOneUser,
  editUser,
  editProfile,
  deleteUser,
  getProducts,
};
