const cheerio = require("cheerio")
const axios = require("axios")
const puppeteer = require('puppeteer')

// Reddit
let scraped_headlines = [];
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto('https://www.reddit.com/r/webscraping/top/?t=all', {timeout: 18000});

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        let posts = $('div[class*="_1oQyIsiPHYt6nx7VOmd1sz"]')

        posts.each((index, element) => {
        title = $(element).find('h3').text()
        p = $(element).find('p').text()
        img = $(element).find('img[class*="_2_tDEnGMLxpM6uOa2kaDB3 ImageBox-image media-element _1XWObl-3b9tPy64oaG6fax"]').attr('src')
        
        if (p == ''){
            p = `none`
        }
        if (img == undefined){
            img = `none`
        }

        scraped_headlines.push({
            'index': index,
            'title': title,
            'p': p,
            'img': img
        })
})
}
catch(err) {
console.log(err);
}
await browser.close();
console.log(scraped_headlines)
})();



let scraped_comments = [];
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto('https://www.reddit.com/r/webscraping/comments/w1ve97/virgin_api_consumer_vs_chad_thirdparty_scraper/', {timeout: 18000});

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        let comments = $('div[id*="-post-rtjson-content"]')

        comments.each((index, element) => {
            c = $(element).find('p').text()

        scraped_comments.push({
            'Comment Number': index,
            'comment': c,
        })
})
}
catch(err) {
console.log(err);
}
await browser.close();
console.log(scraped_comments)
})();



const getQuotes = async () => {
    const { PDFDocument, rgb } = require('pdf-lib');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("http://quotes.toscrape.com", {
    waitUntil: "domcontentloaded",
  });
  const quotes = await page.evaluate(() => {

    const quoteList = document.querySelectorAll(".quote");

    return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
    return { text, author };
    });
  });
  const pdfPath = `page1.pdf`;
  console.log(quotes)
  await page.pdf({ path: pdfPath });
console.log(quotes)
  let nextButtonVisible = await page.$(".pager > .next > a") != null

  let x = 1

  while(nextButtonVisible == true) {
    x += 1
    await page.click(".pager > .next > a")
    const quotes = await page.evaluate(() => {

    const quoteList = document.querySelectorAll(".quote");

    return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
    return { text, author };
    });
  });

  const pdfPath = `page${x}.pdf`;
  console.log(quotes)
  await page.pdf({ path: pdfPath });
  nextButtonVisible = await page.$(".pager > .next > a") != null
};
await browser.close();
return quotes
}

getQuotes()

