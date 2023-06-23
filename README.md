# AWS MFA Util

Simple utility to generate temporary AWS credentials using MFA.

## Installation

### From npm (recommended)

You need to have [Node.js](https://nodejs.org/en/) (and `npm` which is bundled) installed (which optionally can be done using [NVM](https://github.com/creationix/nvm/blob/master/README.md)).

Install the package globally using `npm`:

```bash
npm install -g @missio/aws-mfa-util
```

## Usage

Default profile:

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

## Command line options

| Flag     | Description        | Default              |
|:---------|:------------------:|:---------------------|
| **-c**   | MFA code           |                      |
| **-s**   | Source profile     | `default`            |
| **-o**   | Output profile     | `mfa`                |
| **-f**   | Credentials dir    | `~/.aws/credentials` |
