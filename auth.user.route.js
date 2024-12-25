const express = require('express');
const router = express.Router();

const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');
// const {loginUser} = require('../controllers/')

// register in new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username, role: "user" });
        // console.log(user)
        await user.save();
        res.status(200).send({ message: "User registered successfully!", user: user });

    } catch (error) {
          console.error("Failed to register: ", error);
        res.status(500).send({ message: "Registration failed!"})
   
    }
})

// login a user

router.post("/login", async (req, res) => {
    try {
        // console.log(req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' })
        
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        // generate token here 
        const token = await generateToken(user._id);
        // console.log("Generated token:", token)
        res.cookie("token", token, {
            httpOnly: true,  //enable this only when you have https://
            secure: true,
            sameSite: true
         })
         res.status(200).send({
            message: 'Login successfully!',token, user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
        })

    } catch (error) {
        console.error("Failed to login: ", error);
        res.status(500).send({ message: "login failed! Try again" });
   
    }
});


// logout a user

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: " Logged out successfully done!" });

    } catch (error) {
        console.error("Failed to Log Out", error);
        res.status(500).json({ message: "Logout failed" });

}  
})

// get all users
router.get("/users", async (req, res) => {
    try {
       
         const users = await User.find({}, '_id email role');
        //  negede   const users = Array.isArray(data) ? data : data?.users || [];

        res.status(200).send({message: "Users found successfully", users})

    } catch (error) {
        console.error("Error fetching users",  error);
        res.status(500).json({message: "Failed to fetch users!"})

    }
})

// delete a user 
router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });

    
        }
        res.status(200).send({message: "User deleted successfully!"})

    } catch (error) {
         console.error("Error deleting users", error);
        res.status(500).json({message: "Error deleting users!"})

        
    }
})

// Update a user
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id.trim();
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({message: "User not found"})
        }
        res.status(200).send({message: "User role updated successfully!",user: updatedUser})

    } catch (error) {
         console.error("Error updating  user role", error);
        res.status(500).json({message: "Failed updating user role!"})

        
    }
})
module.exports = router;
