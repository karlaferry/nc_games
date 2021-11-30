const {
  selectCategories,
  selectReviewById,
  checkIfExists,
} = require("../models/games.models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};
