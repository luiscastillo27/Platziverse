'use stric'

const db = require('../')

async function run () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'luis',
    password: process.env.DB_PASS || 'jimyluis',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }
  const { Agent, Metric } = await db(config).catch(handelFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'yyy',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handelFatalError)
  console.log('agent')
  console.log(agent)

  const agents = await Agent.findAll().catch(handelFatalError)

  console.log('agents')
  console.log(agents)
}

function handelFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

run()
