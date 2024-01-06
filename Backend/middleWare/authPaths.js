const api = process.env.API_URL;
const unlessPaths = [
    {
      url: /\/public\/uploads(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/product(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/categorie(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/order(.*)/,
      methods: ["GET", "OPTIONS", "POST"],
    }, {
      url: `http://localhost:5000/api/user/login`,
    },
    `${api}/user/register`,
  ];
  
  module.exports = unlessPaths;