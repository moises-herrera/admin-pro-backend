const { response } = require('express');

const Doctor = require('../models/doctor');

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate('user', 'name')
    .populate('hospital', 'name');

  res.json({
    ok: true,
    doctors,
  });
};

const createDoctor = async (req, res = response) => {
  const { uid } = req;
  const doctor = new Doctor({
    user: uid,
    ...req.body,
  });

  try {
    const doctorDB = await doctor.save();

    res.json({
      ok: true,
      doctor: doctorDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const updateDoctor = async (req, res = response) => {
  res.json({
    ok: true,
    msg: 'updateDoctor',
  });
};

const deleteDoctor = async (req, res = response) => {
  res.json({
    ok: true,
    msg: 'deleteDoctor',
  });
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
