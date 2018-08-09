'use stric'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'luis',
  password: process.env.DB_PASS || 'jimyluis',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s),
  setup: true
}

async function setup () {
  const flags = process.argv.indexOf('yes') === -1 && process.argv.indexOf('simon') === -1

  if (!flags) {
    createDB(config)
  } else {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
      }
    ])
    if (!answer.setup) {
      return console.log('Nothing happened :) ')
    }
    createDB(config)
  }

}

async function createDB (config) {
  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
