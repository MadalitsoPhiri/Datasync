## Data Sync project ##

### Below are the instruction for setting up and runing this project ###

## Introdution ##
There are three major directories inside the src directory. The First one is for Data source A which is source files for the server that is connected to mongodb. The second one is for Data source B which is the server connected to the google sheet api. The Third one is the source scripts to be used in googles appscript api.

The first two directories are express servers with basic endpoints to create, read update and delete user entities from the respective datasources.

## Instructions ##
To Run the first express server you need to start by making sure you have created a mongodb atlas account and created a database. Then copy the mongodb uri link and add it a new file you will create call it .env and structure it like the sample .env  file you will find there.Also you can set the PORT the server will run on in the same .env file.Next you will need to run yarn or npm install in the  root or parent directory to install the packages. Once done you can run the server by running the server.js file at the root of the Data store A directory.

To Run the second express server in Data Store B you need to start by creating a google cloud account and then creating a project. After which you will need to create a service account from the gcloud dashboard . After that you will generate a service key for your service account, make sure you pick Json when genrating the key  it will ask for roles , u should pick owner and continue and skip everthing else,  then download the file. Then put the Json file at the base of Data store B.Now that thats done you need to create a spreadsheet on google sheet and create a sheet named Users. After that you should click on share within the google sheet app online to share the file to the email that you will find inside the Json file or key you downloaded earlier, this is to give persmissions to your service account email to be able to access the sheet.After that get the sheet id which is the string that you see in your url on google sheet after d/ up to /edit and put that string in a new file called .env again , you will see the values you need to provide inside the sample .env ,also you can set your port here as well and also dont forget to set the Sheet name to Users.Finally type yarn or npm install to install libraries. To run the server  type node followed by file name server.js to run the express server.

Head over to google cloud and enable the google sheet api.Then Head over to mongodb atlas and enable the Data api where you will be provided the api key.Hold on to this key.

At this point you should be able to make calls to update the google sheet and also to make calls and update mongodb. 

Lets now setup the sync process. In the Third directory called SyncService you will find a js file called service.js open it and provide your mongodb cluster name and that api key you held on in the previous step.Add the values in the variables on line 23,24 and 58,59.Next copy all contents of the service.js file. Next go to your google sheet online and select Extenions in top menu options. Then Select Apps script, it will open an editor into which you should paste the copied code. Then click save. Move over to the side menu and click triggers, it should take you to a new screen when you will click add trigger. Then a pop up will open select set "Choose which function to run" to onChanges from dropdown, next  set "Select event source" to From SpreadSheet, next set "Select event type"  to on change and click save.Once added Repeat the process and click add trigger then a pop up will appear then set  "Choose which function to run" to SyncData, next set "Select event source" to Time-driven, next set "Select type of time based trigger" to Minutes timer, next set "Select minute interval" to Every minute and finally click save.

The Sync process is now installed,  you can now test the end points and see the data update accordingly. Take note that the letency is one minute for mongodb to sheet but near instant from sheet to mongodb.

## Api DOCS ##

These Docs apply to both of the datasource api servers.

### User Endpoint ###

## POST /api/users/create ##
 This endpoint is used to create a new Users and accepts a json payload with the parameters customerDetails which is an object with the following properties
 - name = String
 - email = String

 example request payload "{
    "customerDetails":{
        "name":"Bruno",
        "email":"Bruno7@gmail.com"

    }
}"

## GET /api/users ###
This endpoint is going to get you all the users

## PUT /api/users/:userid ###
This endpoint is used to update an already existing user and accepts a json payload with the parameters customerDetails which is an object with the following properties
 - name = String
 - email = String

 please note that update wont work from the datasource B Due to technical problems. but it works by entering manully from the  sheets.


