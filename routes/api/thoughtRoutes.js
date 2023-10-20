// const router = require('express').Router();
// const {
//   getAllThoughts,
//   getThoughtById,
//   createThought,
//   updateThought,
//   deleteThought,
//   createReaction,
//   deleteReaction,
// } = require('../../controllers/thoughtController.js');

// // /api/courses
// router.route('/').get(getAllThoughts).post(createThought);

// router.route('/:userId').get(getThoughtById).put(updateThought).delete(deleteThought);

// router.route('/:userId/reaction').post(createReaction).delete(deleteReaction);

// // // /api/courses/:courseId
// // router
// //   .route('/:userId')
// //   .get(getSingleCourse)
// //   .put(updateCourse)
// //   .delete(deleteCourse);

// module.exports = router;

const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  updateThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getSingleThought)
    .delete(deleteThought)
    .put(updateThought);
// /api/thoughts/:userId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:userId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
