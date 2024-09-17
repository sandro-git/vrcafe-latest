
import { defineType, defineField } from "sanity";

export const escapeGames = defineType({
    name: "escapeGames",
    type: "document",
    title: "Escape Games",
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
    ]
})

// import React from 'react';
// import getYouTubeID from 'get-youtube-id';

// const YouTubePreview = ({ value }) => {
//   const id = getYouTubeID(value.url);
//   const url = `https://www.youtube.com/embed/${id}`;
//   if (!id) {
//     return <div>Missing YouTube URL</div>;
//   }
//   return (
//     <iframe
//       title="YouTube Preview"
//       width="560"
//       height="315"
//       src={url}
//       frameBorder="0"
//       allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//     />
//   );
// };

// export default {
//   name: 'youtube',
//   type: 'object',
//   title: 'YouTube Embed',
//   fields: [
//     {
//       name: 'url',
//       type: 'url',
//       title: 'URL',
//     },
//   ],
//   preview: {
//     select: {
//       url: 'url',
//     },
//     component: YouTubePreview,
//   },
// };