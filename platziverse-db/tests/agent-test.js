'use stric'

const test = require('ava')
let db = null

let config = {
  loggin: function(){}
}

test.beforeEach(async () => {
  const setupDataBase = require("../")
  db = await setupDataBase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, "Agent sure exit")
})
