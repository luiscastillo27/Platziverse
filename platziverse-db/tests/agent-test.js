'use stric'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent-fixtures')

let single = Object.assign({}, agentFixtures.single)
let db = null
let AgentStub = null
let sandbox = null
let id = 1
let uuid = 'yyy-yyy-yyy'
let uuidArgs = {
  where: {
    uuid
  }
}

let config = {
  loggin: function () {}
}

let MetricStub = {
  belongsTo: sinon.spy()
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.ByUuId(uuid)))

  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.ById(id)))

  const setupDataBase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDataBase(config)
})

test.afterEach(() => {
  if (sandbox) {
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

test.serial('Agent#findById', async t => {
  let agent = await db.Agent.findById(id)
  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')
  t.deepEqual(agent, agentFixtures.ById(id), 'should be the same')
})

test.serial('Agent#createOrUpdate - exist', async t => {
  let agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with uuid args')
  t.true(AgentStub.update.called, 'agent.update called on model')
  t.true(AgentStub.update.calledOnce, 'agent.update should be called once')
  t.true(AgentStub.update.calledWith(single), 'agent.update should be called with specified args')
  t.deepEqual(agent, single, 'agent should be the same')
})
