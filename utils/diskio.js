const { del } = require("express/lib/application");
const fs = require("fs");

// Check if a folder is exist
async function isFolderExist(path) {
  try {
    const result = await fs.promises.access(path);
    if (!result) return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

// Create a folder by checking the if it is existed first
async function createFolder(path) {
  try {
    const isExist = await isFolderExist(path);
    if (isExist) return path;
    return await fs.promises.mkdir(path, { recursive: true });
  } catch (error) {
    console.log(error.message);
  }
}

// Delete a file from the given path
async function deleteFile(path) {
  try {
    return await fs.promises.unlink(path);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  isFolderExist,
  createFolder,
  deleteFile,
};
