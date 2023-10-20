// const { User, Thought } = require("../models");
// const thoughtController = {
//   async getAllThoughts(req, res) {
//     try {
//       const thoughtData = await Thought.find({})
//         .populate({
//           path: "reactions",
//           select: "-__v",
//         })
//         .select("-__v")
//         .sort({ _id: -1 });
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json(err);
//     }
//   },

//   async getThoughtById(req, res) {
//     try {
//       const thoughtData = await Thought.findOne({ _id: req.params.id })
//         .populate({
//           path: "reactions",
//           select: "-__v",
//         })
//         .select("-__v");
//       if (!thoughtData) {
//         return res
//           .status(404)
//           .json({ message: "No thoughts found with that id!" });
//       }
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json(err);
//     }
//   },

//   async createThought(req, res) {
//     try {
//       console.log(req.body)
//       const thoughtData = await Thought.create(req.body);
//       const thoughtId = thoughtData._id;
  
//       // Assuming you have a user ID associated with the thought, retrieve it from the request or your authentication system.
//       const userId = "replace_with_valid_user_id";
  
//       // Update the user's thoughts with the new thought's ID.
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $push: { thoughts: thoughtId } },
//         { new: true }
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({ message: "No user found with this id!" });
//       }
  
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json(err);
//     }
//   }
  
// ,

//   async updateThought(req, res) {
//     try {
//       const thoughtData = await Thought.findOneAndUpdate(
//         { _id: req.params.id },
//         req.body,
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//       if (!thoughtData) {
//         return res
//           .status(404)
//           .json({ message: "No thoughts found with that id!" });
//       }
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json(err);
//     }
//   },

//   async deleteThought(req, res) {
//     try {
//       const thoughtData = await Thought.findOneAndDelete({
//         _id: req.params.id,
//       });
//       if (!thoughtData) {
//         return res
//           .status(404)
//           .json({ message: "No thoughts found with that id!" });
//       }
//       const userId = thoughtData.userId;
//       const updatedUser = await User.findOneAndUpdate(
//         { _id: userId },
//         { $pull: { thoughts: req.params.id } },
//         { new: true }
//       );
//       if (!updatedUser) {
//         return res.status(404).json({ message: "No User found with this id!" });
//       }
//       res.json(updatedUser);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json(err);
//     }
//   },

//   async createReaction(req, res) {
//     try {
//       const thoughtId = req.params.thoughtId;
//       const reactionData = req.body;
//       const thoughtData = await Thought.findOneAndUpdate(
//         { _id: thoughtId },
//         { $push: { reactions: reactionData } },
//         { new: true, runValidators: true }
//       )
//         .populate({ path: "reactions", select: "-__v" })
//         .select("-__v");
//       if (!thoughtData) {
//         return res.status(404).json({ message: "No thoughts with this ID." });
//       }
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.status(400).json(err);
//     }
//   },

//   async deleteReaction(req, res) {
//     try {
//       const { thoughtId, reactionId } = req.params;
//       const thoughtData = await Thought.findOneAndUpdate(
//         { _id: thoughtId },
//         { $pull: { reactions: { reactionId } } },
//         { new: true }
//       );
//       if (!thoughtData) {
//         return res.status(404).json({ message: "Nope!" });
//       }
//       res.json(thoughtData);
//     } catch (err) {
//       console.error(err);
//       res.json(err);
//     }
//   },
// };

// module.exports = thoughtController;

const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      
           const user = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: {thoughts: thought._id } },
          { runValidators: true, new: true }
          );
          
          res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a thought and remove them from the user
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      // Delete that thought for users
      const userThought = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!userThought) {
        return res.status(404).json({
          message: 'Thought deleted, but no user have that thought',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction to a student
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }

      res.json({message: 'reaction removed'});
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

