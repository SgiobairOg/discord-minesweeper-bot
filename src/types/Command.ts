import { type Client, type ChatInputCommandInteraction, type Collection, type SlashCommandBuilder, type AutocompleteInteraction } from 'discord.js'

export type CommandsCollection = Collection<string, SlashCommand>

export interface ClientWithCommands extends Client {
  commands?: CommandsCollection
}

export interface SlashCommand {
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}
