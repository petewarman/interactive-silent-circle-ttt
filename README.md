# Silent Circle - Take the Test


## Setup

```bash
> npm install
> bower install
```
See ```package.json``` and ```bower.json```


## Build + watch + local server

```bash
> grunt
```

A local server should run on ```http://localhost:8089```
See ```Gruntfile.js```


## Update content
Content is stored in a single JSON file: ```/src/data/data.json```

This JSON file is automatically generated from 2 sources:
- a Google Spreadsheet, that contains the Test data (questions, answers and their scores): https://docs.google.com/spreadsheets/d/1oApMvBX6k8ijToreNOj0HFnHlhL7W6_y7k1d5jjSK7s/pubhtml?gid=0&single=true
- another static JSON file, that contains copy and texts for UI elements + share buttons: ```/src/import-data/lang.json```

To generate an updated JSON file:
- load the page at ```http://localhost:8089/build/import-data/``` (this page will import the data and merge the two sources into a single file)
- click on the link to download the new JSON
- overwrite the old file in ```/src/data/data.json```
- make sure to run the Grunt task to build


## Check paths

If necessary, open ```Gruntfile.js``` and fix the file paths in the ```replace``` task.


## Update hardcoded links to the "Videos" page
The section linking to the "Take the test" page must be updated with the right link: you will find them in the template file at ```/src/js/app/templates/app.html```


## @TODO


- Update the file ```/src/import-data/lang.json``` with copy if necessary


- Update the file ```/src/import-data/lang.json``` with copy for Twitter, LinkedIn, Facebook + link to the Guardian page


- Update the links to the "Videos" page in ```/src/js/app/templates/app.html```

