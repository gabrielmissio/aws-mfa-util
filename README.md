# AWS MFA Util

## Installation

### From npm (recommended)

You need to have [Node.js](https://nodejs.org/en/) (and `npm` which is bundled) installed (which optionally can be done using [NVM](https://github.com/creationix/nvm/blob/master/README.md)).

Install the package globally using `npm`:

```bash
npm install -g @missio/aws-mfa-util
```

## Usage

Given the configuration file above you can use your MFA to generate a code, e.g. `123456`, and generate credentials in the target section:

Defautl profile:

```bash
aws-mfa -c 123456
```

Specific profile:

```bash
aws-mfa -s myProfile123 -c 123456
```

Now AWS CLI commands as well as AWS API based programs can use the credentials by setting the `AWS_PROFILE` environment variable:

```bash
export AWS_PROFILE=mfa
```
