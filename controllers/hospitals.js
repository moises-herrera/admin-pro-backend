const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate('user', 'name img');

  res.json({
    ok: true,
    hospitals,
  });
};

const createHospital = async (req, res = response) => {
  const { uid } = req;
  const hospital = new Hospital({
    user: uid,
    ...req.body,
  });

  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const updateHospital = async (req, res = response) => {
  res.json({
    ok: true,
    msg: 'updateHospital',
  });
};

const deleteHospital = async (req, res = response) => {
  res.json({
    ok: true,
    msg: 'deleteHospital',
  });
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
