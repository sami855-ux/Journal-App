import {defineField, defineType} from 'sanity'

const moodOptions = [
  {title: '😞 1', value: 1},
  {title: '🙁 2', value: 2},
  {title: '😐 3', value: 3},
  {title: '🙂 4', value: 4},
  {title: '😄 5', value: 5},
]

export const journalEntry = defineType({
  name: 'journalEntry',
  title: 'Journal Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'content',
      title: 'Contents',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'moodRating',
      title: 'Mood Rating',
      type: 'number',
      description: 'Select how this entry feels on a scale from 1 (😞) to 5 (😄).',
      options: {
        list: moodOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'AI Generated', value: 'ai-generated'},
          {title: 'Personal', value: 'personal'},
          {title: 'Reflection', value: 'reflection'},
        ],
        layout: 'tags',
      },
      initialValue: ['ai-generated'],
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      mood: 'moodRating',
      categories: 'categories',
    },
    prepare({title, mood, categories}) {
      const subtitleParts: string[] = []

      if (typeof mood === 'number') {
        const emojiMap: Record<number, string> = {
          1: '😞',
          2: '🙁',
          3: '😐',
          4: '🙂',
          5: '😄',
        }
        subtitleParts.push(`Mood ${emojiMap[mood] ?? mood}`)
      }

      if (Array.isArray(categories) && categories.length > 0) {
        subtitleParts.push(categories.join(', '))
      }

      return {
        title,
        subtitle: subtitleParts.join(' • '),
      }
    },
  },
})
