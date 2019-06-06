/**
 * Serves HTML of the application for HTTP GET requests.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
function doGet(e) {
  var spreadID = "1JUf4EvIb4_nxQzL0OZiWCGaxpWF2NA8Vyydr3tdoemo";
  var sheetName = "Sheet1";
  var template = HtmlService.createTemplateFromFile('Index');
  // Retrieve and process any URL parameters, as necessary.
  if (e.parameter.signedIn){
    template.signedIn = e.parameter.signedIn;
  } else{
    template.signedIn = 0;
  }
  if (e.parameter.signedOut){
    template.signedOut = e.parameter.signedIn;
  } else{
    template.signedOut = 0;
  }
  if (e.parameter.signedInAll){
    template.signedInAll = e.parameter.signedInAll;
  } else{
    template.signedInAll = 0;
  }
  if (e.parameter.signedOutAll){
    template.signedOutAll = e.parameter.signedInAll;
  } else{
    template.signedOutAll = 0;
  }
  if (e.parameter.inputType){
    template.inputType = e.parameter.inputType;
  } else{
    template.inputType = 0;
  }
  //Set placeholders as indicators for what stage of the program the user is in
  if(e.parameter.ID){
    template.ID = e.parameter.ID;
    var data = [{range: sheetName+"!Q2",values: [[""]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  } else{
    var data = [{range: sheetName+"!Q2",values: [["a"]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
    template.ID = 0;
  }
  var ss = SpreadsheetApp.openById(spreadID);
  ss.setActiveSheet(ss.getSheetByName(sheetName));
  if(template.ID!=0){
    var data = [{range: sheetName+"!Q1",values: [[template.ID]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  }
  
  var startRow = 2;
  var endRow = ss.getLastRow();
  var getRange = ss.getDataRange();
  var cellValue = 0;
  var idIndex = 0;
  //Set placeholders for input type for access in later stages of the program
  if(template.inputType=="IDNum"){
    var data = [{range: sheetName+"!Q3",values: [["a"]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  }
  if(template.inputType=="ticketNum"){
    var data = [{range: sheetName+"!Q3",values: [[""]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  }  
  //Get what row the entered value is in (ID or tickeet num)
  if(ss.getRange("Q3").getValue()=="a"){
    for (var i = startRow; i <= endRow; i++) {   
      cellValue = ss.getRange("A"+i).getValue();
      if(cellValue==ss.getRange("Q1").getValue()){
        idIndex = i;
      }  
    }
  }
  else{
    for (var i = startRow; i <= endRow; i++) {   
      cellValue = ss.getRange("G"+i).getValue();
      if(cellValue==ss.getRange("Q1").getValue()){
        idIndex = i;
      }  
    }
  }
  if(template.signedIn!=0){ //set H, id index to current time
    var idNum = ss.getRange("A"+idIndex).getValue();
    var d = new Date();
    var data = [{range: sheetName+"!H"+idIndex,values: [[d.toLocaleTimeString()]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  }
  if(template.signedOut!=0){//set I, id index to current time
    var idNum = ss.getRange("A"+idIndex).getValue();
    var d = new Date();
    var data = [{range: sheetName+"!I"+idIndex,values: [[d.toLocaleTimeString()]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
  }
  if(idIndex>0&&ss.getRange("F"+idIndex).getValue()!="n/a"){//If student entered is guest, sets id index to student who brought them
    for (var i = startRow; i <= endRow; i++) {   
      cellValue = ss.getRange("A"+i);
      if(cellValue.getValue()==ss.getRange("F"+idIndex).getValue()){
        idIndex = i;
        i = endRow;
      }  
    }
  }
  if(template.signedInAll!=0){ //set H, id index to current time for all displayed students
    var idNum = ss.getRange("A"+idIndex).getValue();
    var d = new Date();
    var data = [{range: sheetName+"!H"+idIndex,values: [[d.toLocaleTimeString()]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
    for (var i = startRow; i <= endRow; i++) { 
      if(ss.getRange("F"+i).getValue()==idNum&&idNum!="n/a"){
        var d = new Date();
        var data = [{range: sheetName+"!H"+i,values: [[d.toLocaleTimeString()]]}];
        var resource = {valueInputOption: "USER_ENTERED",data:data};
        Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
      }
    }  
  }
  if(template.signedOutAll!=0){//set I, id index to current time for all displayed students
    var idNum = ss.getRange("A"+idIndex).getValue();
    var d = new Date();
    var data = [{range: sheetName+"!I"+idIndex,values: [[d.toLocaleTimeString()]]}];
    var resource = {valueInputOption: "USER_ENTERED",data:data};
    Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
    for (var i = startRow; i <= endRow; i++) { 
      if(ss.getRange("F"+i).getValue()==idNum&&idNum!="n/a"){
        var d = new Date();
        var data = [{range: sheetName+"!I"+i,values: [[d.toLocaleTimeString()]]}];
        var resource = {valueInputOption: "USER_ENTERED",data:data};
        Sheets.Spreadsheets.Values.batchUpdate(resource, spreadID);
      }
    }
  }
  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('Dance Sign-in')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}



function getStudentInfo() {
  var spreadID = "1JUf4EvIb4_nxQzL0OZiWCGaxpWF2NA8Vyydr3tdoemo";
  var sheetName = "Sheet1";
  var ss = SpreadsheetApp.openById(spreadID);
  ss.setActiveSheet(ss.getSheetByName(sheetName));
  var studID = ss.getRange("Q1").getValue();
  var letters = "";
  if(ss.getRange("Q3").getValue()=="a"){//get input type from spreadsheet placeholder
     letters = "A";
  }   
  else{
     letters = "G";
  }
  var contents = {
      children: []
    
  };
  var startRow = 2;
  var endRow = ss.getLastRow();
  var getRange = ss.getDataRange();
  var cellValue = 0;
  var idIndex = 0;
  for (var i = startRow; i <= endRow; i++) {   
    cellValue = ss.getRange(letters+i);
    if(cellValue.getValue()==studID){
      idIndex = i;
    }  
  }
  if(idIndex>0&&ss.getRange("F"+idIndex).getValue()!="n/a"){
    for (var i = startRow; i <= endRow; i++) {   
      cellValue = ss.getRange("A"+i);
      if(cellValue.getValue()==ss.getRange("F"+idIndex).getValue()){
        idIndex = i;
        i=endRow+1;
      }  
    }
  }
  if(ss.getRange("Q1").getValue()=="n/a"){
    contents.children.push("Invalid ID or Ticket Number");
    return contents;
  }
  if(ss.getRange("Q2").getValue()==""&&idIndex>0){//Iterate through the rows corresponding to entered IDs
    var letterNum = "A".charCodeAt(0);
    var idNum = ss.getRange("A"+idIndex).getValue();
    for(var i = 1; i<=7; i++){//Add PHS student info to returned array
      
      var letter = String.fromCharCode(letterNum-1+i);
      cellValue = ss.getRange(letter+idIndex).getValue();
      contents.children.push(ss.getRange(letter+"1").getValue()+":");
      contents.children.push(cellValue);
    } 
    for(var i = startRow; i <= endRow; i++) {//Add guest student info to array
      cellValue = ss.getRange("F"+i);
    
      if(cellValue.getValue()==idNum){
      
        for(var a = 1; a<=7; a++){
          var letter = String.fromCharCode((letterNum-1)+a);
          contents.children.push(ss.getRange(letter+"1").getValue()+":");
          contents.children.push(ss.getRange(letter+i).getValue());
        }
      }  
    }
  }
  else if(ss.getRange("Q2").getValue()==""&&idIndex<=0){//Error message returned if wrong ID
    contents.children.push("Invalid ID or Ticket Number");
  }  
  else{
    contents.children.push(" ");
  }
  return contents;
}
  
