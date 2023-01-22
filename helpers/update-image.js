const fs = require('fs');

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');

const deleteImage = (oldPath) => {
  if (fs.existsSync(oldPath)) {
    // Delete previous image
    fs.unlinkSync(oldPath);
  }
};

const updateImage = async (type, id, fileName) => {
  let oldPath = '';

  switch (type) {
    case 'doctors':
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        console.log('Doctor not found');
        return false;
      }
      oldPath = `./uploads/doctors/${doctor.img}`;
      deleteImage(oldPath);

      doctor.img = fileName;
      await doctor.save();
      break;

    case 'hospitals':
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log('Hospital not found');
        return false;
      }
      oldPath = `./uploads/hospitals/${hospital.img}`;
      deleteImage(oldPath);

      hospital.img = fileName;
      await hospital.save();
      break;

    case 'users':
      const user = await User.findById(id);
      if (!user) {
        console.log('User not found');
        return false;
      }
      oldPath = `./uploads/users/${user.img}`;
      deleteImage(oldPath);

      user.img = fileName;
      await user.save();
      break;
  }

  return true;
};

module.exports = {
  updateImage,
};
