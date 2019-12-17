var dataPictures = require('./content/pictures.json');

module.exports = {
  "plugins": {
    "posthtml-expressions": {
      locals: {
        content: {
          pictures: dataPictures
        }
      },
      delimiters: ['!!', '!!'],
      unescapeDelimiters: ['!!!', '!!!'],
    },
    "posthtml-include": {
      root: "./",
    }
  },
};
