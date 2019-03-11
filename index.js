const fs = require('fs'); // useful for navigating the file system
const parse = require('csv-parse/lib/sync'); // needed for parsing CSV file data

function linkBuyerToFacility() {
  //open and parse the 2 csv files
  const existingFile = fs.readFileSync('./existing-accounts.csv', 'utf-8');
  const existingIDs = parse(existingFile, {
    columns: true,
    skip_empty_lines: true
  });

  const accountsFile = fs.readFileSync('./sam-accounts.csv', 'utf-8');
  const accountsIDs = parse(accountsFile, {
    columns: true,
    skip_empty_lines: true
  });

  //will hold the ids found to be missing.
  //it's a string to make writing to the output file a bit easier
  var missingIDs = "accountHooliId,samUid\n"; 

  //iterate over SAM accounts
  accountsIDs.forEach(rec=>{
    var hooliId = rec.accountHooliId;
    var samUID = rec.samUid;

    //look for match in exisiting accounts
    var matched = false;
    existingIDs.forEach(exrec=>{
        if(exrec.hooliId.substr(0,15) === hooliId)
        matched = true;
    })

    //if there was no match, add it to the list of missing ids
    if (!matched)
      missingIDs += (hooliId + "," + samUID + "\n");
  })

  //write the missing ids to the output file
  fs.writeFileSync("missing-accounts.csv", missingIDs);
}

linkBuyerToFacility();
