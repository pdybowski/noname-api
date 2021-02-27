const express = require('express')
const hotelController = require('../controllers/hotels')
const router = express.Router()

router.get('/', async (req, res, next) => {
  hotelController.getHotels(req, res, next)
})

router.get('/:limit', async (req, res, next) => {
  hotelController.getNumberOfHotels(req, res, next)
})

router.get('/hotel/:hotelId', async (req, res, next) => {
  hotelController.getHotel(req, res, next)
})

router.get('/city/:city', async (req, res, next) => {
  hotelController.getHotelsByCity(req, res, next)
})

module.exports = router
