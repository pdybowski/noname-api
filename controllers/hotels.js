const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const {
  getHotels,
  getHotel,
  getNumberOfHotels,
  getHotelsByCity,
} = require('../services/hotels')

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await getHotels()
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await getHotel(req.params.hotelId)
    res.status(200).send(hotel)
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new ApiError(404, 'Hotel with provided ID not found'))
    }
    next(new ApiError(400, 'Hotel cannot be fetched'))
  }
}

exports.getNumberOfHotels = async (req, res, next) => {
  try {
    const hotels = await getNumberOfHotels(req.params.limit)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}

exports.getHotelsByCity = async (req, res, next) => {
  try {
    const hotels = await getHotelsByCity(req.params.city)
    res.status(200).send(hotels)
  } catch (error) {
    next(new ApiError(400, 'Hotels cannot be fetched'))
  }
}
