import { type BaseInteraction, Events, type ChatInputCommandInteraction, type AutocompleteInteraction, type CacheType } from 'discord.js'
import { type SlashCommand, type ClientWithCommands } from '../types/Command.js'

export default (client: Required<ClientWithCommands>): void => {
  client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    console.info('Recieved an interaction...')
    if (interaction.isChatInputCommand() === true) {
      await handleSlashCommand(client, interaction as ChatInputCommandInteraction)
    }
    if (interaction.isAutocomplete() === true) {
      await handleAutoComplete(client, interaction as AutocompleteInteraction)
    }
  })
}

const sendCommandError = (interaction: ChatInputCommandInteraction | AutocompleteInteraction, content: string): void => {
  console.error(content)
  if (interaction.isRepliable() === true) {
    (interaction as ChatInputCommandInteraction<CacheType>).reply({
      ephemeral: true,
      content
    })
  }
}

const getCommand = (interaction: ChatInputCommandInteraction | AutocompleteInteraction): SlashCommand | undefined => {
  const { client, commandName } = interaction as { client: ClientWithCommands, commandName: string }
  const command = client.commands?.get(commandName)

  if (command === undefined) {
    sendCommandError(interaction, `No command matching ${commandName} was found.`)
    return
  }

  return command
}

const handleAutoComplete = async (client: Required<ClientWithCommands>, interaction: AutocompleteInteraction): Promise<void> => {
  console.info('Handling auto complete interaction...')

  const command = getCommand(interaction)

  if (command?.autocomplete === undefined) {
    sendCommandError(interaction, `Error autocompleting for ${interaction.commandName}.`)
    return
  }

  try {
    await command.autocomplete(interaction)
  } catch (error) {
    sendCommandError(interaction, `Error autocompleting for ${interaction.commandName}.`)
    console.error(error)
  }
}

const handleSlashCommand = async (client: Required<ClientWithCommands>, interaction: ChatInputCommandInteraction): Promise<void> => {
  console.info(`Handling ${interaction.commandName.toUpperCase()} interaction...`)

  const command = getCommand(interaction)

  try {
    await command?.execute(interaction)
  } catch (error) {
    sendCommandError(interaction, `Error executing ${interaction.commandName}.`)
    console.error(error)
  }
}
