# Simple Student Web Server Client 

In this repo, we used: 

* use `javaScript` to write function 
* use `express-generator`, to quickly create an application skeleton
* use `google chart api` to draw chart
* use `sendgrid` for transactional email
* use `tailwind css` for css   

### What's in the download?
The download includes :
```
Skeleton/
├── README.md
├── apps.js
├── package.json
├── crud.sql
├── bin
│   └── www
├── public
│   └── stylesheets
│        └── style.css
├── routes
│   ├── index.js
│   └── input.js
└── views
    ├── error.pug
    ├── index.pug
    ├── edit.pug
    ├── forgot.pug
    ├── inputUser.pug
    ├── login.pug
    ├── input.pug
    ├── input.html
    ├── statistic.pug
    └── layout.pug
```
### How to Use
1. Make sure you have installed `npm` in your PC
2. Make sure you have installed `mysql` in your PC
3. Make sure you have `sendgrid` account
4. Install `google chart api` with command :
    `npm i -D google-charts`
5. Install `sendgrid` with this command :
    `npm install --save @sendgrid/mail`
6. Update the development environment with your `SENDGRID_API_KEY`, for example:
    ```
    echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
    echo "sendgrid.env" >> .gitignore
    source ./sendgrid.env
    ```
7. Download file in this repo or clone this repo, with command :
    `https://github.com/Qisti/CRUD-HTML-NodeJs`
8. Import `crud.sql` to your database 
9. running in CLI with command :
    `DEBUG=databaseApp:* npm start`
10. Open in your browser with url `localhost:3000/students`