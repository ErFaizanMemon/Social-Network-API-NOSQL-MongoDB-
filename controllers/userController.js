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

  async getUserById(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.userId });
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      await Thought.deleteMany({
        _id: { $in: userData.thoughts },
      });
      res.json({ message: "user deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "friend not added" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "friend not deleted" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
