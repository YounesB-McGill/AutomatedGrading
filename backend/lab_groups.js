#!/usr/bin/env node

"use strict";

try {
  var fs = require('fs'); // to allow some functions to be called from the frontend 
} catch (e) {}

const STUDENT_FILE = "students.csv";

const LAB_GROUPS_FILE = "labgroups.csv";

// Used for debugging (not real names)
const TEST_STUDENT_DATA = `
Alice Apple,alice.apple@mail.mcgill.ca,EE,1
Bob Bill,bob.bill2@mail.mcgill.ca,EE,2
Cathy Cat,cathy.cat@mail.mcgill.ca,EE,2
Donald Duck,donald.duck@mail.mcgill.ca,EE,1
Emily Emoji,emily.emoji@mail.mcgill.ca,SE,2
Fang Feng,fang.feng2@mail.mcgill.ca,EE,2
Gary Google,gary.google@mail.mcgill.ca,EE,3
Harry Happy,harry.happy@mail.mcgill.ca,EE,1
Ian Ion,ian.ion@mail.mcgill.ca,EE,3
Jen Johnson,jen.johnson@mail.mcgill.ca,CE,2
Ke Koa,ke.koa@mail.mcgill.ca,EE,1,SE,2
Lilly Lemon,lilly.lemon@mail.mcgill.ca,EE,2
Mathieu Martin-Côté,mathieu.martin-cote@mail.mcgill.ca,EE,1
Nancy Narwhal,nancy.narwahl@mail.mcgill.ca,CE,3
Olivier O'Connor,olivier.oconnor@mail.mcgill.ca,CE,1
Please Pull,please.pull@mail.mcgill.ca,EE,2
Queen Québécoise,queen.quebecoise@mail.mcgill.ca,EE,1
Richard Reilly,richard.reilly@mail.mcgill.ca,EE,2
Stuart Smith,stuart.smith@mail.mcgill.ca,SE,2
Thomas Trudeau,thomas.trudeau@mail.mcgill.ca,EE,1
Unity Utica,unity.utica@mail.mcgill.ca,EE,1
Veronica de la Vérendrye-Noisette,veronica.delaverendrye-noisette@mail.mcgill.ca,SE,1
Walter Wall,walter.wall@mail.mcgill.ca,SE,3
Xavier Xylophone,xavier.xylophone@mail.mcgill.ca,EE,1
Yi Yang,yi.yang4@mail.mcgill.ca,SE,3
Zoë Zeller,zoe.zeller@mail.mcgill.ca,CE,2
`;

class Student {
  constructor(name, email, major, year) {
    this.name = name;
    this.email = email;
    this.major = major;
    this.year = parseInt(year);
  }

  toString() {
    return this.name + "," + this.email + "," + this.major + "," + this.year;
  }
}

class LabGroup {
  constructor(number, members) {
    this.number = number;
    this.members = members;
  }

  addMember(member) {
    this.members.push(member);
  }

  toString() {
    return this.number + this.members.reduce((acc, member) => acc + "," + member);
  }
}


function makeLabGroupsFromStudents(students) {
  const nLabGroups = calculateNumberOfLabGroups(students);
  const labGroups = Object.seal(Array.from(Array(nLabGroups).keys(), n => new LabGroup(n + 1, [])));

  const gee = major => Array.from(Array(4).keys(), n => getStudentsWithMajorAndInYear(students, major, n));
  const gcs = major => Array.from(Array(4).keys(), n => getStudentsWithMajorAndInYear(students, major, 4 - n));
  const ee = gee("EE");
  const ce = gcs("CE");
  const se = gcs("SE");

  const nVacantGroups = () => labGroups.filter(g => g.members.length == 0).length;
  const nGroupsWithOneMember = () => labGroups.filter(g => g.members.length == 1).length;

  const add = (student) => {
    if (nVacantGroups() > 0) labGroups[labGroups.length - nVacantGroups()].addMember(student);
    else labGroups[labGroups.length - nGroupsWithOneMember()].addMember(student);
  };

  const majors = [ee, ce, se];

  majors.forEach(major => {
    [1, 2, 3].forEach(year => major[year].forEach(student => add(student)));
  });

  return labGroups;
}

function getStringRepresentation(labGroups) {
  return ["", ...labGroups].reduce(
      (accumulator, group, i) => accumulator + "\n" + i + "," + group.members).substring(1);
}

function getStringRepresentationOfStudentEmailsByGroupNumber(labGroups) {
  return ["", ...labGroups].reduce((accumulator, group, i) => {
    const emails = group.members.map(m => m.email);
    return accumulator + "\n" + i + "," + emails;
  }).substring(1);
}


/**
 * Returns an array of Student objects.
 * 
 * The `csvString` input must be in the format
 * 
 * ```
 * Alice Apple,alice.apple@mail.mcgill.ca,EE,1
 * Bob Bill,bob.bill2@mail.mcgill.ca,EE,2
 * Cathy Cat,cathy.cat@mail.mcgill.ca,EE,2
 * ```
 * 
 * @param {string} csvString
 */
function getStudentInfoFromCsv(csvString) {
  return Array.from(csvString.split("\n"), row => {
    if (row != "") return new Student(...row.split(",")); // ... spreads arguments
  }).filter(student => student !== undefined);
}

/**
 * Returns students with the specified major.
 * 
 * @param {Array} students
 * @param {string} major 
 */
function getStudentsWithMajor(students, major) {
  return students.filter(student => student.major == major);
}

/**
 * Returns students in the specified year.
 * 
 * @param {Array} students
 * @param {number} year 
 */
function getStudentsInYear(students, year) {
  return students.filter(student => student.year == year);
}

/**
 * Returns students with the specified major and in the specified year.
 * 
 * @param {Array} students
 * @param {string} major
 * @param {number} year 
 */
function getStudentsWithMajorAndInYear(students, major, year) {
  return students.filter(student => student.major == major && student.year == year);
}

function calculateNumberOfLabGroups(students) {
  return Math.ceil(students.length / 2);
}


function fileToString(filename) {
  var result = "";
  try {
    result = fs.readFileSync(filename, 'utf8');
  } catch(e) {
    console.log('Error:', e.stack);
  }
  return result;
}

function stringToFile(string, filename) {
  fs.writeFile(filename, string, (err) => {
    if (err) return console.log(err);
  });
}

/** Call this to save the lab groups to a CSV file. */
function serialize() {
  const labGroups = makeLabGroupsFromStudents(getStudentInfoFromCsv(fileToString("student-emails-and-majors.csv")));
  stringToFile(getStringRepresentationOfStudentEmailsByGroupNumber(labGroups), "students.txt");
}

function test() {
  const labGroups = makeLabGroupsFromStudents(getStudentInfoFromCsv(TEST_STUDENT_DATA));
  
  //console.log(labGroups);
  console.log(getStringRepresentationOfStudentEmailsByGroupNumber(labGroups));
}

test();
