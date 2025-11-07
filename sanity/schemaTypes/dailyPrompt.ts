import {defineArrayMember, defineField, defineType} from 'sanity'

export const dailyPrompt = defineType({
  name: 'dailyPrompt',
  title: 'Daily Prompt',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'category'}],
        }),
      ],
    }),
    defineField({
      name: 'isAIGenerated',
      title: 'AI Generated',
      type: 'boolean',
      initialValue: true,
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
      ai: 'isAIGenerated',
    },
    prepare({title, ai}) {
      return {
        title,
        subtitle: ai ? 'AI-generated' : 'Manual',
      }
    },
  },
})
