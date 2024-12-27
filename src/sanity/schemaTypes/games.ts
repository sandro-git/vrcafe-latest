
import { defineType, defineField } from "sanity";

export const Games = defineType({
    name: "escapeGames",
    type: "document",
    title: "Games",
    fields: [
        defineField({
            name: "name",
            type: "string",
            title: "Name",
        }),
        defineField({
            name:"slug",
            type: "slug",
            title: "Slug",
            options: {
                source: "name",
            }
        }),
        defineField({
            name: 'youtube',
            type: 'string',
            title: 'Youtube',
        }),
        defineField({
            name:"text",
            type: "text",
            title: "Text",
        }),
        defineField({
            name: "image",
            type: "image",
            title: "Image",
        }),
        defineField({
            name: "tag",
            type: "string",
            title: "Tag",
            options: {
                list: [
                  {title: 'Escape Game', value: 'escapeGame'},
                  {title: 'Jeux VR', value: 'jeuxVR'},
                  {title: 'Freeroaming', value: 'freeroaming'},
                  {title: 'Escape Freeroaming', value: 'escapeFreeroaming'},
                ]
            }
        }),
        defineField({
            name: "editeur",
            type: "string",
            title: "Editeur",
            options: {
                list: [
                  {title: 'ARVI', value: 'arvi'},
                  {title: 'OCTOPOD', value: 'octopod'},
                  {title: 'LDLC', value: 'ldlc'},
                  {title: 'UBISOFT', value: 'ubisoft'},
                  {title: 'VEX', value: 'vex'},
                ]
            }
        })
    ]
})
