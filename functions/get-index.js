'use strict'

const fs = require('fs').promises

let html

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

module.exports.handler = async () => {
  let html = await loadHtml()

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  }
}
