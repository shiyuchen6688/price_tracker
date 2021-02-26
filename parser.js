// Parse the page and keep track of the price

// This is the span we are looking at
// <span id="priceblock_ourprice" class="a-size-medium a-color-price priceBlockBuyingPriceString">CDN$&nbsp;888.88</span> 

require('dotenv').config(); // load all env var in .env file to the porcess.env
const sgMail = require('@sendgrid/mail');
// console.log(process.env.SENDGRIPD_API_KEY);
sgMail.setApiKey(process.env.SENDGRIPD_API_KEY); // set API key for all request made by this application

let nightmare = require('nightmare');

// allow user to pass parameter
// CONSTNATS:
const args = process.argv.slice(2);

// const PRODUCT_URL = "https://www.amazon.ca/Samsung-LC34J791WTNXZA-34-inch-Curved-Monitor/dp/B07CS3JB5K";
const PRODUCT_URL = args[0];

const PRICE_SPAN_ID = "priceblock_ourprice";

// const EXPECTED_PRICE = 1800;
const EXPECTED_PRICE = parseFloat(args[1]);

async function checkPrice() {
    try {
        const priceString =
            await nightmare.goto(PRODUCT_URL)
                .wait(`#${PRICE_SPAN_ID}`)
                .evaluate(() => document.getElementById("priceblock_ourprice").innerText) // TODO: find out how to store id in variable to be more dynamic
                .end();

        // priceString format: CDN$&nbsp;888.88
        const parsedPriceString = priceString.split(" ")[0].split("$")[1].trim();
        const price = parseFloat(parsedPriceString);

        if (price < EXPECTED_PRICE) {
            await sendEmail("Your Item is Below Your Expected Price!",
                `The item you are watching: ${PRODUCT_URL} has dropped below your expected price ${EXPECTED_PRICE},
            You might want to go for it now!`);
            console.log("dude this sale is huge, let's notify the buyer!");
        }
    } catch (e) {
        // Log friendly error
        console.error(e);

        if (e.response) {
            // Extract error msg
            const { message, code, response } = e;

            // Extract response msg
            const { headers, body } = response;

            console.error(body);
        }

    }
}

function sendEmail(subject, body) {
    const email = {
        to: "shiyuchen66668888@gmail.com",
        from: "shiyuchen6688@gmail.com",
        subject: subject,
        text: body,
        html: body
    };

    return sgMail.send(email);
}

// Program start here:
nightmare = new nightmare();
checkPrice();