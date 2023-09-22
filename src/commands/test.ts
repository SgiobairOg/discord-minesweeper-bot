import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction } from 'discord.js'

export const Test = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Basic command to test minesweeper.'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const content = 'I sweep, therefore I am.'
    await interaction.reply({
      ephemeral: true,
      content
    })
  }
}
