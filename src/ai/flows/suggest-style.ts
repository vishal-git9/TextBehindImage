'use server';

/**
 * @fileOverview Suggests trending font and color combinations based on a category.
 *
 * - suggestStyle - A function that suggests font and color combinations.
 * - SuggestStyleInput - The input type for the suggestStyle function.
 * - SuggestStyleOutput - The return type for the suggestStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStyleInputSchema = z.object({
  category: z.string().describe('The category for which to suggest styles (e.g., technology, fashion, food).'),
});
export type SuggestStyleInput = z.infer<typeof SuggestStyleInputSchema>;

const SuggestStyleOutputSchema = z.object({
  fontFamily: z.string().describe('The suggested font family name (e.g., Poppins).'),
  colorPalette: z.array(z.string()).describe('An array of suggested color hex codes (e.g., ["#FFFFFF", "#000000"]).'),
});
export type SuggestStyleOutput = z.infer<typeof SuggestStyleOutputSchema>;

export async function suggestStyle(input: SuggestStyleInput): Promise<SuggestStyleOutput> {
  return suggestStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStylePrompt',
  input: {schema: SuggestStyleInputSchema},
  output: {schema: SuggestStyleOutputSchema},
  prompt: `You are a design expert. Based on the given category, suggest a trending font family and a color palette consisting of 2-3 colors. The font family should be a Google Font. Return the font family name and an array of color hex codes. 

Category: {{{category}}}`,
});

const suggestStyleFlow = ai.defineFlow(
  {
    name: 'suggestStyleFlow',
    inputSchema: SuggestStyleInputSchema,
    outputSchema: SuggestStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
