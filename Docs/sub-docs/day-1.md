# Day - 1

### Folder Structure

```bash
├── node_modules
├── index.js
├── package-lock.json
└── package.json
```

## What is external Package?
 > Understand External packeages and implimentation of externel code base from `npm.js` website 

Run `npm install <package_name>` to install the package.


 ### For context: 
 `cat-me` package it is a most fun package when you need to play and learn in same time

 ```javascript 
const catMe = require("cat-me");
console.log(catMe.catNames);

 ```
 ### Output:
```javascript
  catNames: [
    'grumpy',
    'approaching',
    'tubby',
    'confused',
    'playful',
    'thoughtful',
    'delighted',
    'nyan',
    'resting'
  ]

```

---

## What is `node_modules` folder stands for?

> node modules is a folder that is stands for to collect all `dependencies` and `sub-dependencies` code store init.


### e.g `cat-me` Package Dependency Tree:


```javascript
cat-me
 └── yargs
     ├── cliui
     ├── camelcase
     ├── decamelize
     ├── os-locale
     │   └── lcid
     │       └── invert-kv
     ├── string-width
     │   ├── strip-ansi
     │   │   └── ansi-regex
     │   └── is-fullwidth-code-point
     │       └── number-is-nan
     ├── wrap-ansi
     ├── window-size
     └── y18n
```

## What is `package.json` file stands for?

> It standes for multiple things one of them is `dependencies object`.


### e.g `cat-me` Package `package.json`:

```javascript
{
  "dependencies": {
    "cat-me": "^1.0.3"
  }
}
```

## What is `package-lock.json` file stands for?

> It standes for Collection of dependencies, dependency.


### e.g `cat-me` Package Dependency Tree 
Click to see: [Click here](#eg-cat-me-package-dependency-tree)

---
---