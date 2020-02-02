"use strict";

// Switch to https when deploying to actual server
const SERVER_URL = "http://localhost:8003/app.js";

var currentLab;


/** Shorthand for document.getElementById(). */
function g(id) {
  return document.getElementById(id);
}

/** Returns true if element is checked. */
function c(input) {
  return g(input).checked;
}

function openLab(evt, labNum) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  currentLab = labNum;
  g("lab" + labNum).style.display = "block";
  evt.currentTarget.className += " active";
}

function generateReceipt() {
  let receiptElement = g("receipt" + currentLab);
  receiptElement.innerHTML = "";

  let questions = c("part_und" + currentLab)? 5 : c("full_und" + currentLab)? 10 : 0;
  if (currentLab == 5) questions /= 2;
  const questionWeight = (currentLab == 5? 5 : 10);

  const part2Names = [null, "Bang-Bang Controller", "Float Motors", "Angle Localization", "Simple Navigation",
      "Stationary Launch"];
  const part2Notes = [null, (c("bb_done")? 10 : 0) + "/10",
    "XY: " + (c("fmxy_done")? 5 : 0) + "/5, Theta: " + (c("fmt_done")? 5 : 0) + "/5",
    (c("part_al")? 2.5 : (c("full_al")? 5 : 0)) + "/5",
    "Minimal Angle: " + (c("minangle_done")? 5 : 0) + "/5, Distance Error: " + 
        (c("part_snavd")? 2.5 : (c("full_snavd")? 5 : 0)) + "/5",
    c("ssr1")? 2 : (c("ssr2")? 4 : (c("ssr3")? 6 : (c("ssr4")? 8 : c("ssr5")? 10 : 0))) + "/10"
  ];
  const part2Grades = [null, c("bb_done")? 10 : 0,
    (c("fmxy_done")? 5 : 0) + (c("fmt_done")? 5 : 0),
    c("part_al")? 2.5 : (c("full_al")? 5 : 0),
    (c("minangle_done")? 5 : 0) + (c("part_snavd")? 2.5 : (c("full_snavd")? 5 : 0)),
    c("ssr1")? 2 : (c("ssr2")? 4 : (c("ssr3")? 6 : (c("ssr4")? 8 : c("ssr5")? 10 : 0)))
  ];

  const part3Names = [null, "P-Type Controller", "Odometer Check", "Ultrasonic Localization", "Obstacle Avoidance", 
      "Mobile Launch"];
  const part3Notes = [null, (c("p_done")? 10 : 0) + "/10",
    "Distance Error: " + (c("part_odod")? 2.5 : (c("full_odod")? 5 : 0)) + "/5, Theta error: " +
        (c("part_odot")? 2.5 : (c("full_odot")? 5 : 0)) + "/5",
    "Theta error: " + (c("part_lt")? 2.5 : (c("full_lt")? 5 : 0)) + "/5, Distance error: " +
        (c("ld5")? 5 : (c("ld7")? 7.5 : (c("ld10")? 10 : 0))) + "/10" +
        (["lld5", "lld7", "lld10"].some(e => c(e))?
            "<br>Light Localization (Bonus): " + (c("lld5")? 5 : (c("lld7")? 7.5 : (c("lld10")? 10 : 0))) + "/10" :
            ""),
    "Avoid all obstacles: " + (c("oa_done")? 5 : 0) + "/5, Distance error: " +
        (c("part_anavd")? 2.5 : (c("full_anavd")? 5 : 0)) + "/5",
    c("msr1")? 3 : (c("msr2")? 6 : (c("msr3")? 9 : (c("msr4")? 12 : c("msr5")? 15 : 0))) + "/15"
  ];
  const part3Grades = [null, c("p_done")? 10 : 0,
    (c("part_odod")? 2.5 : (c("full_odod")? 5 : 0)) + (c("part_odot")? 2.5 : (c("full_odot")? 5 : 0)),
    (c("part_lt")? 2.5 : (c("full_lt")? 5 : 0)) + (c("ld5")? 5 : (c("ld7")? 7.5 : (c("ld10")? 10 : 0))) +
        (c("lld5")? 5 : (c("lld7")? 7.5 : (c("lld10")? 10 : 0))),
    (c("oa_done")? 5 : 0) + (c("part_anavd")? 2.5 : (c("full_anavd")? 5 : 0)),
    c("msr1")? 3 : (c("msr2")? 6 : (c("msr3")? 9 : (c("msr4")? 12 : c("msr5")? 15 : 0)))
  ];

  const receiptText = `
    <b>ECSE211 Lab ${currentLab} Receipt</b><br>
    ${addGroupNumberToReceiptTextIfSet()}<br>
    Questions: ${questions}/${questionWeight}<br>
    ${part2Names[currentLab]}: ${part2Notes[currentLab]}<br>
    ${part3Names[currentLab]}: ${part3Notes[currentLab]}<br>
    <b>Total: ${questions + part2Grades[currentLab] + part3Grades[currentLab]}/30</b><br>
  `;

  // fallback used on old browsers
  const plainReceiptText =
    `ECSE211 Lab ${currentLab} Receipt\n` +
    `${addGroupNumberToReceiptTextIfSet()}\n` +
    `Questions: ${questions}/${questionWeight}\n` +
    `${part2Names[currentLab]}: ${part2Notes[currentLab]}\n` +
    `${part3Names[currentLab]}: ${part3Notes[currentLab]}\n` +
    `Total: ${questions + part2Grades[currentLab] + part3Grades[currentLab]}/30\n`;

  receiptElement.innerHTML += receiptText;
  setClipboard(receiptText, plainReceiptText);

  // Call backend to email students and update spreadsheets (WIP)
  const groupNum = getGroupNumber();
  if (groupNum) {
    // Uncomment this once the backend is setup, or for local testing only
    // callBackend(currentLab, groupNum, receiptText);
  } else {
    alert("Please enter a valid lab group number.");
  }
}

function callBackend(labNum, groupNum, receipt) {
  console.log(labNum, groupNum, receipt);

  $(document).ready(function() {
    var jqueryXHR = $.ajax({
      type: 'POST',
      url: SERVER_URL,
      dataType: 'json',
      data: {
        // TODO Add TA information here later
        'labNum': labNum,
        'groupNum': groupNum,
        'receipt': receipt
      },
    });
    jqueryXHR.always(function(resp) {
      console.log(resp);
    });
  });
}

/**
 * Sets the clipboard to text, or if that is not possible, to plaintext. 
 * asyncClipboard should be enabled in Firefox.
 * 
 * See browser documentation on copying html to clipboard.
 */
function setClipboard(text, plaintext) {
  var fallback = () => legacySetClipboard(plaintext);
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    fallback();
    return;
  }

  try {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      try {
        let data = new DataTransfer();

        if (navigator.clipboard.write) {
          data.items.add("text/html", text);
          navigator.clipboard.write(data).then(() => {}, fallback);
        } else if (navigator.clipboard.writeText) {
          data.items.add("text/plain", plaintext);
          navigator.clipboard.writeText(data.types[0]).then(() => {}, fallback);
        } else {
          fallback();
        }
      } catch (error) {
        fallback();
      }
    });
  } catch (error) {
    fallback();
  }
}

/**
 *  Legacy method to copy plaintext to clipboard on old browsers.
 *
 *  Adapted from techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
 */
  function legacySetClipboard(str) {
  var el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

/**
 * Returns the group number, or null if not set or invalid.
 */
function getGroupNumber() {
  let n = g("group_num").value;
  if (n == "" || isNaN(n))
    return null;
  return parseInt(n);
}

/**
 * Clears the group number, to allow writing another one easily.
 */
function clearGroupNumber() {
  g("group_num").value = "";
  g("group_num").focus();
}

/**
 * Adds the group number to receipt text if it is set.
 */
function addGroupNumberToReceiptTextIfSet() {
  const n = getGroupNumber();
  if (n == null) return "";

  return `Group number: ${n}`;
}