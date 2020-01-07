'use strict';

//require('dotenv').config();

const fs = require('fs');
const https = require('https');
const http = require('http');
const puppeteer = require('puppeteer');
const querystring = require('querystring');

const MS_AUTH_URL = "http://localhost:3000/";
const MAIL_PATH = "mail";

const WAIT_TIME = 3500; // ms

const PORT = 8002;

/** 
 * Read into memory once at runtime to avoid reading the file each time a receipt is generated.
 * 
 * Each line must be in the format `<GROUP_NUM>,<EMAIL1>[,<EMAIL2>]`, eg
 * 
 *    `1,alice.apple@mail.mcgill.ca,please.pull@mail.mcgill.ca
 *     2,donald.duck@mail.mcgill.ca,richard.reilly@mail.mcgill.ca`
 */
const studentEmails = Object.assign({}, ...fs.readFileSync("student-emails-by-group.csv", "utf8").split("\n")
    .filter(line => line.includes("@"))
    .map(line => {
      const csl = line.split(",");
      return { [parseInt(csl[0])]: csl.slice(1) };
    }));

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Read credentials from secrets.txt, which must never be committed
let creds;
try {  
  creds = JSON.parse(fs.readFileSync("secrets.txt", "utf8"));
} catch(e) {
  console.log(e);
}

try {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Switch to https when deploying to actual server
    var server = http.createServer(options, (request, response) => {
      const { headers, method, url } = request;
      let body = [];
      console.log('Called app.js \n');
      response.setHeader("Access-Control-Allow-Origin", "*");

      request.on('data', (info) => {
        body.push(info);
      }).on('end', () => {
        body = Buffer.concat(body).toString(); 
        const query = querystring.parse(body);

        response.on('error', (err) => { console.error(err); });

        handleQuery(page, query);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');

        console.log(query);

        response.write(JSON.stringify({"Done": 294}));
        response.end();

      });
    }).listen(PORT);

  })();
} catch (e) {
  console.error(e);
}

function handleQuery(page, query) {
  const {labNum, groupNum, receipt} = query;

  // Send email to students
  const emails = getEmailsFromGroupNum(groupNum);
  const subject = `ECSE211 Lab ${labNum} Receipt`;
  
  sendMail(page, emails, subject, receipt);
}

function sendMail(page, addresses, subject, contents) {
  try {
    (async () => {
      await page.goto(MS_AUTH_URL);

      const loginButton = await page.$(".btn-primary");

      if (loginButton) {
        await page.click(".btn-primary");
        await page.waitFor(WAIT_TIME);
        let pageContent = await page.content();

        if (pageContent.includes("Email or phone")) {
          await page.type("input", creds.email);
          await page.click(".btn");
          await page.waitFor(WAIT_TIME);
          await page.type("#passwordInput", creds.password);
          await page.click("#submitButton");
          console.log("Submitting");
          await page.waitFor(WAIT_TIME);

          pageContent = await page.content();
          if (pageContent.includes("Stay signed in?")) {
            await page.click(".btn-primary");
            await page.waitFor(WAIT_TIME);
          }
        }
      }

      // Uncomment this to save a screenshot of the page
      //await page.screenshot({path: "debug.png"});

      await page.goto(makeEmailURL(addresses, subject, contents));
      console.log("Done!");
    })();
  } catch (e) {
    console.error(e);
  }
}

function makeEmailURL(addresses, subject, contents) {
  return MS_AUTH_URL + MAIL_PATH + "?" + querystring.stringify({
    addresses: addresses,
    subject: subject,
    body: contents
  });
}

function getEmailsFromGroupNum(groupNum) {
  return studentEmails[groupNum.toString()];
}
