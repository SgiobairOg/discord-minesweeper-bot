import { Client, Collection, Events } from 'discord.js'
import { type ClientWithCommands } from './types/Command.js'
import { Sweep } from './commands/sweep.js'
import { Test } from './commands/test.js'
import interactionCreate from './listeners/interactionCreate.js'
import { setCommands } from './commands.js'

if (process.env.DISCORD_TOKEN === undefined) {
  process.exitCode = 1
  throw new Error('DISCORD TOKEN is not set, cannot run app.')
}

console.info('Going aloft to light the lamps...')

const client: ClientWithCommands = new Client({ intents: [] })

client.once(Events.ClientReady, eventData => {
  console.info(`Logged in as ${eventData.user.tag}. Three green lamps, minesweeping in progress.`)
})

client.commands = new Collection()

setCommands(client.commands, [Sweep, Test])

interactionCreate(client as Required<ClientWithCommands>)

client.login(process.env.DISCORD_TOKEN)
