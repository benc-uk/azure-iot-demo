// Grab input parameters from command line, two required params:
//  {storage-acct-name} {access-key}
var args = process.argv.slice(2);

var azure = require('azure-storage');
var tableService = azure.createTableService(args[0], args[1]);
var blobService = azure.createBlobService(args[0], args[1]);

tableService.deleteTableIfExists('iottable', function (error, result, response) {
    if (!error) {
        console.log(" ### Table deleted, going to re-create it in 10secs... "); setTimeout(createTable, 10000);
    } else {
        console.error(error)
    }
});

createTable = function () {
    tableService.createTableIfNotExists('iottable', function (error, result, response) {
        if (!error) {
            console.log(" ### Table created! ");
        } else {
            if(error.statusCode == 409) { console.log(" ### Table still being deleted, retry in 10sec... "); setTimeout(createTable, 10000); }
        }
    });
}

blobService.deleteContainerIfExists('iot-messages', function (error, result, response) {
    if (!error) {
        console.log(" ### Container deleted, going to re-create it in 5secs... "); setTimeout(createContainer, 5000);
    } else {
        console.error(error)
    }
});

createContainer = function () {
    blobService.createContainerIfNotExists('iot-messages', function (error, result, response) {
        if (!error) {
            console.log(" ### Container created! ");
        } else {
            if(error.statusCode == 409) { console.log(" ### Container still being deleted, retry in 5sec... "); setTimeout(createContainer, 5000); }
        }
    });
}

