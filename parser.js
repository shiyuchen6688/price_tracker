// Parse the page and keep track of the price

// This is the span we are looking at
// <span id="priceblock_ourprice" class="a-size-medium a-color-price priceBlockBuyingPriceString">CDN$&nbsp;888.88</span> 

let nightmare = require('nightmare');

// CONSTNATS:
const PRODUCT_URL = "https://www.amazon.ca/Samsung-LC34J791WTNXZA-34-inch-Curved-Monitor/dp/B07CS3JB5K";
const PRICE_SPAN_ID = "priceblock_ourprice";
const EXPECTED_PRICE = 1800;

async function checkPrice() {
    const priceString =
        await nightmare.goto(PRODUCT_URL)
            .wait(`#${PRICE_SPAN_ID}`)
            .evaluate(() => document.getElementById("priceblock_ourprice").innerText) // TODO: find out how to store id in variable
            .end();

    // priceString format: CDN$&nbsp;888.88
    console.log(priceString, typeof (priceString));
    const parsedPriceString = priceString.split(" ")[0].split("$")[1].trim();
    console.log(parsedPriceString);
    const price = parseFloat(parsedPriceString);

    console.log(price);
    if (price < EXPECTED_PRICE) {
        console.log("dude this sale is huge, let's notify the buyer!");
    } else {
        console.log("nope, you have to wait");
    }


}

// Program start here:
nightmare = new nightmare();
checkPrice()