const fs = require("fs");
const path = require("path");
const multer = require("multer");

/*
  In storage:
    destination: a function that used to specify the folder for saving file
    filename: a function that used to specify the filename when saving
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const saveLocation = path.resolve(
      "..",
      "yujia-online-storage-backend",
      "storage",
      req.user.id,
      ""
    );
    cb(null, saveLocation);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

/*
  The middleware function (specifically to multer) that filter out the unwanted
  file before saving.

  Here, a valid file is
    1. No greater than 80 Mb.
    2. Filename contains only alphabet, digits, and dash "-".
    3. Length of the filename is no longer than 140 character.

*/
function fileFilter(req, file, cb) {
  // Extract the filename
  const filename = file.originalname;
  const nameLength = filename.length;

  // Check the regex
  const invalidName = /[\~\!\@\#\$\%\^\&\*\(\)\+\=\[\]\;\'\"\<\>\?\/]/g.test(
    filename
  );

  // Check if the file is valid
  if (nameLength > 140 || nameLength === 0 || invalidName) {
    req.accpetUpload = false;
    cb(null, false);
  } else {
    req.accpetUpload = true;
    cb(null, true);
  }
}

// The actual middleware that export to other modules
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 8, // 80 Mb limit
  },
});

module.exports = { upload };
