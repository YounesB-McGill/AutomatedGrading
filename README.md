# Automated grading

This application automates the process of assigning grades and feedback for student submissions.
It is designed and implemented by Younes Boubekeur. This application is currently in development.

## Frontend

A sample frontend is provided, to generate lab grade receipts to be given to students
after they demonstrate a project component.
Click [here](https://mcgill-dpm.github.io/ReceiptGenerator/lab_receipt-beta.html)
to see what this sample looks like (the linked example does not call the backend).

## Backend

The backend is composed of these components:

* **Automatic Mailer:** This is an app in Microsoft Azure.
It depends on the Microsoft Graph API to send emails from a `@mcgill.ca` email address.
This needs to be set up according to [its own README](https://github.com/jasonjoh/node-tutorial).

  This mailer can be used to send lab receipts to students, as well as written feedback on their
  submitted code, which can be sent as HTML or as an attachment.
  
* **Mock student project:** This is a representative example of a student project that will be graded,
along with the grading infrastructure. Code is checked for style and analyzed statically.
Unit tests are also run on the code. The result of these checks is summarized in a human-readable report.

* **Grade database:** This component will allow multiple app users to write grades to a centralized
location concurrently. The grades can then be exported in bulk to a LMS (Learning Management System).  

## Real World™ usage

This application is currently in the process of being deployed in phases to serve
undergraduate ECE students at McGill University. 
