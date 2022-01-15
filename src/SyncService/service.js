function onChange(e) {
    var sheet = e.source.getActiveSheet();
    var range = sheet.getActiveRange();
    var row = range.getLastRow();
    const insertEndpoint = 'https://data.mongodb-api.com/app/data-nchgl/endpoint/data/beta/action/updateOne';
  
    if(sheet.getName() === "Users"){
        SpreadsheetApp.getActiveSpreadsheet().toast(">" + e.changeType + " " + row + " " + sheet.getName()) ;
        const values = SpreadsheetApp.getActive().getRange(`Users!A${row}:C${row}`).getValues()[0]
         console.log(values);
         const datapayload = {}
               if(row === 1){
                     // is frst row
               }else{
    if(values[0] == '' &&  values[1] == '' && values[2] == ''){
                  //row empty
  
                }else if(values[0] == '' || values[0] == null || values[0] == undefined ){
  
                }else{
              datapayload["_id"] = values[0]
                              datapayload["name"] = values[1]
                              datapayload["email"] = values[2]
                      // console.log(payload)       
  
              
                  // 
  
                  const clusterName = ""// your mongodb cluster here
                  const mongodbApiKey = ""// your api key here
  
  
  
                const payload = {
                collection: "users", database: "datasync", dataSource: clusterName,  "filter": { _id:datapayload._id },update: {
            $set: {
               ...datapayload
            }
        }, _id:false,upsert:true,timestamps:true,document:{...datapayload}
              }
  
  
                const options = {
                method: 'post',
                contentType: 'application/json',
                payload: JSON.stringify(payload),
                headers: { "api-key": mongodbApiKey }
              };
  
  
              const response = UrlFetchApp.fetch(insertEndpoint, options);
              console.log(response.getContentText())
                            }
                              
               }
                
              
         
  
    }
  
  
  }
  
  const SyncData = ()=>{
  
  const findEndpoint = 'https://data.mongodb-api.com/app/data-nchgl/endpoint/data/beta/action/find';
  
  const clusterName = ""// your mongodb cluster here
  const mongodbApiKey = ""// your api key here
  
  
  
    const payload = {
    collection: "users", database: "datasync", dataSource: clusterName
   }
  
  
    const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { "api-key": mongodbApiKey }
   };
  
   const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
   const sheet = activeSheetsApp.getSheets()[0];
   const response = UrlFetchApp.fetch(findEndpoint, options);
  
  
  
    console.log("last Row", sheet.getLastRow())
   const documents = JSON.parse(response.getContentText()).documents;
   for(let i = 0; i < documents.length; i++){
      
           let doc = documents[i]
           let row = i + 2
          fields = [[doc._id, doc.name, doc.email]]
          sheet.getRange(`A${row}:C${row}`).setValues(fields)
  
   }
  
  
  }
  