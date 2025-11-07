import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Category',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to mark system categories available to everyone.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      default: 'isDefault',
    },
    prepare({title, default: isDefault}) {
      return {
        title,
        subtitle: isDefault ? 'Default category' : undefined,
      }
    },
  },
})
