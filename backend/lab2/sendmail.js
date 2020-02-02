#!/usr/bin/env node

"use strict";

// This requires pandoc to be installed and the Microsoft Outlook mailer (in another repo) to be running

const { execSync } = require("child_process");
const fs = require('fs');
const puppeteer = require("puppeteer");
const querystring = require("querystring");

const checkstyleHtml = execSync(
  'pandoc checkstyle-output.md -s --highlight-style pygments --metadata pagetitle="Checkstyle output"'
).toString('utf8');

if (checkstyleHtml.includes("does not exist")) {
  process.exit(1);
}

const groupNum = getGroupNumFromFile();

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

    // TODO Send all emails at once here (requires folder reorg)

    handleQuery(page, query);
  })();
} catch (e) {
  console.error(e);
}

function getGroupNumFromFile() {
  return parseInt(fs.readFileSync("groupnum.txt", "utf8").trim());
}
