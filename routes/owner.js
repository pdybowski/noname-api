const mongoose = require('mongoose')
const express = require('express')
const { Hotel, validate } = require('../models/hotel')
const { Reservation } = require('../models/reservation')
const ApiError = require('../helpers/apiError')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/hotels', async (req, res) => {
  const hotel = await Hotel.find()

  res.status(200).send(hotel)
})

router.post('/hotel', async (req, res) => {
  const { error } = validate(req.body)
  if (error) throw new ApiError(400, error.details[0].message)

  const hotel = new Hotel(req.body)

  await hotel.save()

  res.status(200).send(hotel)
})

router.put('/hotel/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) throw new ApiError(400, error.details[0].message)
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body)

    res.status(200).send(hotel)
  } catch (err) {
    console.log(err)
    throw new ApiError(500, 'Something went wrong')
  }
})

router.delete('/hotel/:id&:force', async (req, res) => {
  const id = req.params.id
  const force = req.params.force
  let message = ''
  try {
    const reservation = await Reservation.find({ hotelId: id })

    if (reservation.length > 0 && force === 'false')
      throw new ApiError(
        400,
        'Remove reservations first or set flag force to true, please'
      )

    if (reservation.length > 0 && force === 'true') {
      await Reservation.deleteMany({ hotelId: id })
      message = 'and reservations '
    }

    await Hotel.findByIdAndDelete(id)

    const hotels = await Hotel.find()
    res.status(200).send({ message: `Hotel ${message}deleted`, hotels: hotels })
  } catch (err) {
    console.log(err)
    throw new ApiError(500, 'Something went wrong')
  }
})

router.delete('/reservation/:id', async (req, res) => {
  const id = req.params.id
  try {
    const reservation = await Reservation.findByIdAndDelete(id)
    if (!reservation) {
      throw new ApiError(404, 'Reservation with given ID was not found')
    }

    const startDate = new Date(reservation.startDate)
    const currentDate = new Date('<YYYY-mm-ddTHH:MM:ssZ>')

    const msPerDay = 1000 * 60 * 60 * 24
    const msBetween = startDate.getTime() - currentDate.getTime()
    const days = Math.floor(msBetween / msPerDay)

    if (reservation.isPaid || days <= 3) {
      throw new ApiError(
        400,
        'Can not delete reservation; reservation is paid or or there is less than 3 days to start the stay in the hotel'
      )
    }

    res.status(200).send('Reservation deleted')
  } catch (err) {
    console.log(err)
    throw new ApiError(500, 'Something went wrong')
  }
})

module.exports = router
