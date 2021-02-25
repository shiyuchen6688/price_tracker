// Parse the page and keep track of the price

// This is the span we are looking at
// <span id="priceblock_ourprice" class="a-size-medium a-color-price priceBlockBuyingPriceString">CDN$&nbsp;888.88</span> 

const nightmare = require('nightmare');

// CONSTNATS:
PRODUCT_URL = "https://www.amazon.ca/Samsung-LC34J791WTNXZA-34-inch-Curved-Monitor/dp/B07CS3JB5K"
PRICE_SPAN_ID = "priceblock_ourprice";
EXPECTED_PRICE = 800;


nightmare = new Nightmare();

async function checkPrice() {
    const priceString =
        nightmare.goto(PRODUCT_URL)
            .wait(`#${PRICE_SPAN_ID}`)
            .evaluate(() => document.getElementById(PRICE_SPAN_ID).innerText)
            .end();

    // priceString format: CDN$&nbsp;888.88
    const parsedPriceString = priceString.split(";")[1];
    const price = parseFloat(parsedPriceString);

    if (price < EXPECTED_PRICE) {
        console.log("dude this sale is huge, let's notify the buyer!");
    }


}