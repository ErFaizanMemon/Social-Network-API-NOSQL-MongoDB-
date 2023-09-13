const { User, Thought } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },

  // ...other controller functions for getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend
};

module.exports = userController;
