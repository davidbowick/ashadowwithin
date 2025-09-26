const videoBackground = {
  name: "videoBackground",
  title: "Video Background",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "Label to help identify this video in the CMS",
    },
    {
      name: "youtubeId",
      type: "string",
      title: "YouTube Video ID",
      description: "Paste just the ID (the part after v= in the URL)",
    },
    {
      name: "width",
      type: "number",
      title: "Video Width",
      description: "Original video width (e.g. 3840)",
    },
    {
      name: "height",
      type: "number",
      title: "Video Height",
      description: "Original video height (e.g. 1574)",
    },
    {
      name: "active",
      type: "boolean",
      title: "Active?",
      description: "Check this to make this the current background video",
    },
  ],
};

export default videoBackground;