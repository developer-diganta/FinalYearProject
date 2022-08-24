// File to store the programming language ids of judge0-ce.p.rapidapi.com
const axios = require("axios");
require('dotenv').config();

const programmingLanguageIds = async () => {
  console.log("Asset Hit");
  const options = {
      method: 'GET',
      url: 'https://judge0-ce.p.rapidapi.com/languages',
      headers: {
        'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
        'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
      }
  };
    //returns the programming language ids of judge0-ce.p.rapidapi.com
  let ids = await axios.request(options);
  try {
    return ids.data;
  } catch (error) {
    console.error(error);
  }
}

// const ids = programmingLanguageIds();

module.exports = programmingLanguageIds;