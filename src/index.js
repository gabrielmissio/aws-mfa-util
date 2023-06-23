const fs = require('fs')
const ini = require('ini')
const { STSClient, GetSessionTokenCommand } = require('@aws-sdk/client-sts')

const args = process.argv.slice(2)
const options = parseArguments(args)
const credentials = ini.parse(fs.readFileSync(options.credentialsFilePath, 'utf8'))

async function main () {
  const profile = credentials[options.sourceProfile]

  if (!profile) {
    throw new Error(`Profile ${options.sourceProfile} not found`)
  }

  if (!profile.mfa_serial) {
    throw new Error(`Profile ${options.sourceProfile} does not have mfa_serial`)
  }

  const stsClient = new STSClient({
    credentials: {
      accessKeyId: profile.aws_access_key_id,
      secretAccessKey: profile.aws_secret_access_key
    }
  })

  const sessionToken = await stsClient.send(
    new GetSessionTokenCommand({
      SerialNumber: profile.mfa_serial,
      TokenCode: options.mfaCode
    })
  )

  const mfaProfile = createOrUpdateMFAProfile(sessionToken.Credentials)
  console.log(`New credentials have been saved to the profile ${options.outputProfile}, expires ${mfaProfile.expiration}`)
}

function createOrUpdateMFAProfile (sessionToken) {
  const mfaProfile = {
    aws_access_key_id: sessionToken.AccessKeyId,
    aws_secret_access_key: sessionToken.SecretAccessKey,
    aws_session_token: sessionToken.SessionToken,
    expiration: sessionToken.Expiration.toISOString()
  }

  credentials[options.outputProfile] = mfaProfile
  fs.writeFileSync(options.credentialsFilePath, ini.stringify(credentials), 'utf8')

  return mfaProfile
}

function parseArguments (args) {
  const options = {
    mfaCode: null,
    sourceProfile: 'default',
    outputProfile: 'mfa',
    credentialsFilePath: `${process.env.HOME}/.aws/credentials`
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-c' && i < args.length - 1) {
      options.mfaCode = args[i + 1]
    } else if (args[i] === '-s' && i < args.length - 1) {
      options.sourceProfile = args[i + 1]
    } else if (args[i] === '-o' && i < args.length - 1) {
      options.outputProfile = args[i + 1]
    } else if (args[i] === '-f' && i < args.length - 1) {
      options.credentialsFilePath = args[i + 1]
    }
  }

  return options
}

main().catch((err) => console.error(err))
