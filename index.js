const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const cors = require("cors")
const app = express()

app.use(cors({ origin: "*" }))
const PORT = process.env.PORT || 3000

async function webscrapper(category,res) {
  let news = []

  try {
    let url
    switch (category) {
      case "anime":
        url = `https://www.cbr.com/category/anime-news/`
        break;
      case "movie":
        url = "https://www.cbr.com/category/movies/news-movies/"
        break;
      case "comic":
        url = "https://www.cbr.com/category/comics/news/"
        break;
      case "series":
        url = "https://www.cbr.com/category/tv/news-tv/"
        break;
      case "games":
        url = "https://www.cbr.com/category/game-news/"
        break;
      default:
        url = false
        break;
    }

    const categoryNotFoundError = { error: "Category not found. Available categories is anime,movie,series,games,comic" }
    if (!url) return res.json(categoryNotFoundError);

    const responce = await axios.get(url)
    const html = responce.data
    const $ = cheerio.load(html)

    $(".display-card.article.small", html).each(function () {
      const image = $(this).find('source').attr("srcset")
      const heading = $(this).find("h5").text().replace(/\s\s+/g, '')
      const des = $(this).find("p").text().replace(/\s\s+/g, '')
      const source = "https://www.cbr.com/"
      const newNews = { image, heading, des, source }
      news = [...news, newNews]

    })

    res.json(news)
  } catch (error) {
    res.send(error.name)
  }

}

app.get('/:id', async (req, res) => {
  const category = req.params.id
  webscrapper(category ,res)
})

app.listen(PORT, () => {
  console.log("Online Now");
})