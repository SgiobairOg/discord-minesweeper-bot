import { type CommandsCollection, type SlashCommand } from './types/Command.js'

export const setCommands = (collection: CommandsCollection, commands: SlashCommand[]): void => {
  commands.forEach(command => collection.set(command.data.name, command))
}
