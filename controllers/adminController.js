const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')
const {
  addCity,
  getUsers,
  getHotelOwners,
  acceptUserToOwner,
  deleteOwner,
  deleteUsers,
  deleteHotel,
  verifyOwner,
} = require('../services/adminService')

exports.addCity = async (req, res, next) => {
  try {
    const city = await addCity(req.body)
    res.status(200).send(city)
  } catch (error) {
    next(error)
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getUsers(USER_ROLE, HOTEL_OWNER_ROLE)
    res.status(200).send(users)
  } catch (error) {
    next(error)
  }
}

exports.getHotelOwners = async (req, res, next) => {
  try {
    const owners = await getHotelOwners()
    res.status(200).send(owners)
  } catch (error) {
    next(error)
  }
}

exports.acceptUserToOwner = async (req, res, next) => {
  try {
    await acceptUserToOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

exports.deleteOwner = async (req, res, next) => {
  try {
    await deleteOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

exports.deleteUsers = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteUsers(req.body, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

exports.deleteHotel = async (req, res, next) => {
  try {
    const { forceDelete } = req.query
    const isForceDelete = forceDelete === 'true'
    await deleteHotel(req.params.id, isForceDelete)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

exports.verifyOwner = async (req, res, next) => {
  try {
    await verifyOwner(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
