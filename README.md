# Simple Student Web Server Client 

In this repo, we used: 

* use `javaScript` to write function 
* use `express-generator`, to quickly create an application skeleton
* use `google chart api` to draw chart
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
    ├── input.pug
    ├── input.html
    ├── statistic.pug
    └── layout.pug
```
### How to Use
1. Make sure you have installed `npm` in your PC
2. Download file in this repo or clone this repo, with command :
    `https://github.com/Qisti/CRUD-HTML-NodeJs`
3. Import `crud.sql` to your database 
4. running in CLI with command :
    `DEBUG=databaseApp:* npm start`
5. Open in your browser with url `localhost:3000/students`
