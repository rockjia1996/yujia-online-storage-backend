const { searchFileTrackers } = require("../models/tracker");

// isAvaiable is a middleware function that check if the user uses all the
// the free space that is allocated to them.
async function isAvailable(req, res, next) {
  try {
    const { email } = req.user;
    const trackers = await searchFileTrackers({ email });
    const usage = trackers.reduce(
      (acc, currentTracker) => acc + currentTracker.size,
      0
    );

    const remain = 100000000 - usage;
    if (remain <= 0) return res.send({ isAvailable: false });
    req.freeDiskSpace = remain;
    next();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { isAvailable };
