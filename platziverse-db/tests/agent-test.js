'use stric'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let db = null
let AgentStub = null
let sandbox = null

let config = {
  loggin: function () {}
}

let MetricStub = {
  belongsTo: sinon.spy()
}

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()
  AgentStub = {
    hasMany: sandbox.spy()
  }
  const setupDataBase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDataBase(config)
})


test.afterEach( () => {
  if(sandbox){
     sandbox.restore()
  }
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the model MetricModel')
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the model AgentModel')
})
