'use strict'

const fs = require('fs').promises
const Mustache = require('mustache')
const http = require('superagent-promise')(require('superagent'), Promise)

let html
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const restaurantsApiRoot = process.env.restaurants_api

const loadHtml = async () => {
  try {
    if (!html) {
      html = await fs.readFile('static/index.html', 'utf-8')
    }

    return html
  } catch (err) {
    console.log(err)
  }
}

const getRestaurants = async () => {
  const restaurants = await http.get(restaurantsApiRoot)

  return restaurants.body
}

module.exports.handler = async () => {
  let template = await loadHtml()
  let restaurants = await getRestaurants()
  let dayOfWeek = days[new Date().getDay()]
  let html = Mustache.render(template, { dayOfWeek, restaurants })

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  }
}
