var excelbuilder = require('msexcel-builder-colorfix');
var moment = require('moment');

function callback(err, location) {
    if (err)
        return err;
    return location;
};

function excelGenerator(path, data, callback) {
    // Create a new workbook file in current working-path 
    var workbook = excelbuilder.createWorkbook(path, data.filename);

    var headerArray = data.head;
    var bodyArray = data.body;

    // Create a new worksheet with 30 columns and 30 rows 
    var sheet1 = workbook.createSheet('Test Plan', headerArray.length, bodyArray.length+5);

    // Column headers
    
    for (var i = 1; i < headerArray.length; i++)
        sheet1.set(i, 1, headerArray[i-1].text);

    // Add border around all headers
    sheet1.border(1, 1, {left:'thin',top:'thin',bottom:'thin'});
    sheet1.border(headerArray.length, 1, {top:'thin',right:'thin',bottom:'thin'});
    for (var i = 2; i < headerArray.length; i++)
        sheet1.border(i, 1, {left:'thin',top:'thin',right:'thin',bottom:'thin'});

    for (var i = 1; i < headerArray.length + 1; i++) {
        sheet1.set(i, 1, headerArray[i-1].text);
        // Fill in header column with orange, accent 6, lighter 80%
        sheet1.fill(i, 1, {type:'solid', fgColor: headerArray[i-1].bgcolor});
        sheet1.width(i, headerArray[i-1].width);
    }

    // Wrap text for all the headers
    for (var i = 1; i < headerArray.length + 2; i++) {
        sheet1.wrap(i, 1, 'true');
        sheet1.align(i, 1, 'center');
    }
    
    var row = 2;
    // Enter data into spreadsheet.
    for (var i = 0; i < bodyArray.length; i++) {
        for(var j=0; j<headerArray.length;j++){
            sheet1.set((j+1), row, bodyArray[i][j]);
        }
        row = row + 1;
    }

    // Save it 
    workbook.save(function(err) {
        if (!err) {
          console.log('congratulations, your workbook created');
          callback('', './');
        } else {
          workbook.cancel();
          callback(err, '');
        }
    });
}

module.exports = excelGenerator;