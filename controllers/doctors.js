const { response } = require('express');

const Doctor = require('../models/doctor');

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate('user', 'name')
    .populate('hospital', 'name img');

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
  const { uid } = req;
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: 'Doctor not found',
      });
    }

    const updatedFields = {
      ...req.body,
      user: uid,
    };

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({
      ok: true,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: true,
      msg: 'Something went wrong',
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: 'Doctor not found',
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Doctor deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const getDoctorById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id)
      .populate('user', 'name')
      .populate('hospital', 'name img');

    res.json({
      ok: true,
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
