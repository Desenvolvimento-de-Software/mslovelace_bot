# Ada Lovelace

This is a Telegram bot that can be used to manage groups on the platform.
It was written to run on Bun/TypeScript, but can run on node.js as well.

The name Ada Lovelace was chosen because she was the first programmer in history, as the bot was initially created for a group of software development students.

## How to start

### Install dependences
`bun install`

### Prisma Client Generate
`bun prisma generate`

### Run

`bun run ./src/index.ts`

## It can be transpiled and run with node.js as well.

### Install dependences
`npm install`

### Start in development mode
`npm run dev`

### Build
`npm run build`

### Start
`npm run node-start`


## Environment Variables

- PORT
- AUTH
- DATABASE_URL
- DEBUG
- TELEGRAM_BOT_TOKEN
- TELEGRAM_POLLING_TIMEOUT
- TELEGRAM_USER_ID
- TELEGRAM_USERNAME
- TELEGRAM_WEBHOOK_ACTIVE


## Database

The database used is MySQL, and the ORM used is Prisma.


## Telegram API

The Telegram API is used to interact with the platform. The bot is able to manage groups, users, and messages.


## Combot Anti-Spam API

The Combot Anti-Spam API is used to check if a user is a spammer. The bot will not allow a user to join a group if they are marked as a spammer and the AdaShield is on.


## AdaShield

The AdaShield is a feature where the bot will check if a user is a spammer before allowing them to join a group. If the user is marked as a spammer, they are immediately banned.

