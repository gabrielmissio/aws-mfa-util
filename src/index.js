const fs = require('fs')
const ini = require('ini')

const args = process.argv.slice(2)
const options = parseArguments(args)

const credentialsFile = `${process.env.HOME}/.aws/credentials`
const credentials = ini.parse(fs.readFileSync(credentialsFile, 'utf8'))

// Fake credentials
createOrUpdateMFAProfile({
  AccessKeyId: 'AA11',
  SecretAccessKey: 'BB22',
  SessionToken: 'CC33'
})

function createOrUpdateMFAProfile (sessionToken) {
  const mfaProfile = {
    aws_access_key_id: sessionToken.AccessKeyId,
    aws_secret_access_key: sessionToken.SecretAccessKey,
    aws_session_token: sessionToken.SessionToken
  }

  credentials[`${options.profileTarget}-mfa`] = mfaProfile

  fs.writeFileSync(credentialsFile, ini.stringify(credentials), 'utf8')
}

function parseArguments (args) {
  const options = {
    profileTarget: 'default',
    mfaCode: null
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-s' && i < args.length - 1) {
      options.profileTarget = args[i + 1]
    } else if (args[i] === '-c' && i < args.length - 1) {
      options.mfaCode = args[i + 1]
    }
  }

  return options
}
