const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');

const uploadFile = async (req, res = response) => {
  const { type, id } = req.params;

  const validTypes = ['hospitals', 'doctors', 'users'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: `It's not a doctor, user or hospital`,
    });
  }

  // Validate file exists
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No files were uploaded',
    });
  }

  // Process image
  const file = req.files.image;
  const splittedFileName = file.name.split('.');
  const fileExtension = splittedFileName[splittedFileName.length - 1];

  // Validate extension
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({
      ok: false,
      msg: 'File extension is not allowed',
    });
  }

  // Generate file name
  const fileName = `${uuidv4()}.${fileExtension}`;

  // Path for saving the file
  const path = `./uploads/${type}/${fileName}`;

  // Move image
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: 'Error when moving image',
      });
    }

    // Update database
    updateImage(type, id, fileName);

    res.json({
      ok: true,
      msg: 'File uploaded',
      fileName,
    });
  });
};

const getImage = (req, res = response) => {
  const { type, photo } = req.params;

  let pathImage = path.join(__dirname, `../uploads/${type}/${photo}`);

  // Default image
  if (!fs.existsSync(pathImage)) {
    pathImage = path.join(__dirname, `../uploads/no-img.jpg`);
  }

  res.sendFile(pathImage);
};

module.exports = {
  uploadFile,
  getImage,
};
