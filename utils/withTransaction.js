const mongoose = require("mongoose");

/**
 * Wrap a controller function in a MongoDB transaction.
 *
 * @param {Function} handler - async function(req, res, session)
 */
const withTransaction = (handler) => async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await handler(req, res, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } finally {
    session.endSession();
  }
};

module.exports = withTransaction;
