import { SlashCommandBuilder } from 'discord.js'
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js'
import { getArmedGrid, getLevelOptions } from '../minesweep.js'

export const Sweep = {
  data: new SlashCommandBuilder()
    .setName('sweep')
    .setDescription('Get a new Minesweeper game.')
    .addStringOption(option =>
      option
        .setName('level')
        .setDescription('Set the game level, defaults to normal.')
        .setAutocomplete(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const level = interaction.options.get('level', true).value as string
    console.log({ level })
    const content = getArmedGrid({ level: parseInt(level, 10) })
    await interaction.reply({
      content
    })
  },
  autocomplete: async (interaction: AutocompleteInteraction) => {
    const focusedValue = interaction.options.getFocused()
    const choices = getLevelOptions()
    const filtered = choices.filter((choice) => {
      if (focusedValue !== null) {
        return choice.name.startsWith(focusedValue)
      }
      return true
    })
    await interaction.respond(
      filtered
    )
  }
}
