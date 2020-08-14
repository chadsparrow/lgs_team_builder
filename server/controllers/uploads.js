module.exports = {
  // @desc    Uploads a file to uploads folder
  // @route   POST /api/v1/uploads
  // @access  Private
  uploadFile: async (req, res, next) => {
    res.status(200).send({ message: 'COOL!' });
  },
};
