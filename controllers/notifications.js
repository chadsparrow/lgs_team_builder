const logger = require('../middleware/logger');
const { Member, validateNotification } = require('../models/Member');

module.exports = {
  // @desc    Gets all notifications for current user
  // @route   GET /api/v1/notifications/me
  // @access  Private
  getMeNotifications: async (req, res, next) => {
    try {
      const member = await Member.findById(req.member._id);
      if (!member)
        return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);
      return res.send(member.notifications);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Adds a notification to all recipients in request body
  // @route   POST /api/v1/notifications/
  // @access  Private
  addNotifications: async (req, res, next) => {
    try {
      const { error } = validateNotification(req.body);
      if (error) return res.status(400).send(error.details);

      const today = new Date();
      const newNotification = {
        date: today,
        message: req.body.message,
        clickTo: req.body.clickTo
      };

      const { recipients } = req.body;

      for (recipient of recipients) {
        await Member.updateOne({ _id: recipient }, { $push: { notifications: newNotification } });
      }
      return res.status(200).send([{ message: 'Notification sent' }]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Deletes all notifications for current member
  // @route   DELETE /api/v1/notifications/all
  // @access  Private
  deleteAllNotifications: async (req, res, next) => {
    try {
      await Member.updateOne({ _id: req.member._id }, { $set: { notifications: [] } });
      return res.status(200).send([{ message: 'Notifications cleared' }]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Deletes specific notification from current member
  // @route   DELETE /api/v1/notifications/:id
  // @access  Private
  deleteNotification: async (req, res, next) => {
    try {
      const member = await Member.updateOne(
        { _id: req.member._id },
        { $pull: { notifications: { _id: req.params.id } } }
      );
      if (!member)
        return res.status(400).send([{ message: 'Notification with the given ID not found' }]);

      return res.status(200).send([{ message: 'Notification deleted' }]);
    } catch (err) {
      logger.error(err);
    }
  }
};
