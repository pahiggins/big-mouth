'use strict'

const fs = require('fs').promises
const Mustache = require('mustache')
const http = require('superagent-promise')(require('superagent'), Promise)
const aws4 = require('aws4')

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
  let url = new URL(restaurantsApiRoot)
  let opts = {
    host: url.hostname,
    path: url.pathname
  }

  aws4.sign(opts)

  const restaurants = await http
    .get(restaurantsApiRoot)
    .set('Host', opts.headers['Host'])
    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
    .set('Authorization', opts.headers['Authorization'])
    .set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token'])

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
