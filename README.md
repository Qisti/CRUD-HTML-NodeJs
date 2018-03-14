# Simple Student Web Server Client 

In this repo, we used: 

* use `javaScript` to write function 
* use `express-generator`, to quickly create an application skeleton
* use `google chart api` to draw chart
* use `tailwind css` for css template
* use `mysql` for database

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
    ├── input.pug
    ├── input.html
    ├── statistic.pug
    └── layout.pug
```
### How to Use
1. Make sure you have installed `npm` in your PC
2. Make sure you have installed `mysql` in your PC
3. Install google chart with command :
    `npm i -D google-charts`
4. Download file in this repo or clone this repo, with command :
    `https://github.com/Qisti/CRUD-HTML-NodeJs`
5. Import `crud.sql` to your database 
6. running in CLI with command :
    `DEBUG=databaseApp:* npm start`
7. Open in your browser with url `localhost:3000/students`
