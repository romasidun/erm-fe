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
    // Add border around all headers
    for (var i = 0; i < headerArray.length; i++){
        var col = i + 1;
        sheet1.border(col, 1, {left:'thin',top:'thin',right:'thin',bottom:'thin'});
        sheet1.set(col, 1, headerArray[i].text);
        sheet1.fill(col, 1, {type:'solid', fgColor: headerArray[i].bgcolor});
        // sheet1.width(col, headerArray[i].width);
        sheet1.wrap(col, 1, 'true');
        sheet1.align(col, 1, 'center');

    }


    var row = 2;
    // Enter data into spreadsheet.
    for (var i = 0; i < bodyArray.length; i++) {
        for(var j=0; j<headerArray.length;j++){
            col = ( j + 1 );
            sheet1.set(col, row, bodyArray[i][j]);
            sheet1.border(col, row, {left:'thin',top:'thin',right:'thin',bottom:'thin'});
            sheet1.fill(col, row, {type:'solid', fgColor: 'ffffff'});
            sheet1.wrap(col, row, 'true');
            sheet1.align(col, row, 'center');
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