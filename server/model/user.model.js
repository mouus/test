const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: [true, "Password Required"],
        },
        comment: {
            type: String,
            required: [true, "Comment Required"],
        },
    },
    { timestamps: true } // Optional: Adds createdAt and updatedAt fields
);

// Export the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;