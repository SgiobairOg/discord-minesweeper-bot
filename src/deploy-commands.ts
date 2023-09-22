import { Collection, REST, Routes } from 'discord.js'
import { type CommandsCollection } from './types/Command.js'

import { Sweep } from './commands/sweep.js'
import { Test } from './commands/test.js'
import { setCommands } from './commands.js'

if (process.env.DISCORD_TOKEN === undefined) {
  process.exitCode = 1
  throw new Error('DISCORD TOKEN is not set, cannot run app.')
}

const commands: CommandsCollection = new Collection()

setCommands(commands, [Test, Sweep])

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  if (process.env.APP_ID === undefined) {
    process.exitCode = 1
    throw new Error('APP_ID is not set, cannot run app.')
  }

  try {
    console.log(`Started refreshing ${commands.size} application (/) commands.`)

    const data = await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands.map(command => command.data.toJSON()) }
    )

    if (
      typeof data === 'object' &&
      data !== null &&
      'length' in data &&
      typeof data.length === 'number'
    ) {
      console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    }
  } catch (error) {
    console.error('An error occured while reloading commands.')
    console.error(error)
  }
})()
