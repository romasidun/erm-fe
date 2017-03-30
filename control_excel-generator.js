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
    var testPlan_data = data.testPlan_data;

    // Create a new worksheet with 30 columns and 30 rows
    var colsNum = headerArray.length;
    var rowsNum = bodyArray.length + 7;
    var sheet1 = workbook.createSheet('Test Plan', colsNum, rowsNum);

    var plan_row = 2;
    for (var i = 0; i < testPlan_data.length; i++) {
        for(var j=0; j < 5;j++){
            var col = ( j + 2 );
            sheet1.set(col, plan_row, testPlan_data[i][j]);
            sheet1.font(col, plan_row, {
                name:'Calibri',
                color:'000fff',
                sz:'11',
                family:'1',
                scheme:'-',
                bold:'true',
                iter:'true'
            });

            // if(j%2 == 1){
            //     sheet1.font(col, plan_row, {
            //         name:'Calibri',
            //         sz:'11',
            //         family:'1',
            //         scheme:'-',
            //         bold:'true',
            //         iter:'true',
            //         color:'fff000'
            //     });
            // }
            // if(j%2 == 0){
            //     sheet1.font(col, plan_row, {
            //         name:'Calibri',
            //         sz:'11',
            //         family:'1',
            //         scheme:'-',
            //         bold:'true',
            //         iter:'true',
            //         color:'000fff'
            //     });
            // }
            // sheet1.fill(col, plan_row, {type:'solid', fgColor: 'cccccc'});
            sheet1.fill(col, plan_row, {type:'solid',fgColor:'cccccc'});
            sheet1.wrap(col, plan_row, 'true');
            sheet1.align(col, plan_row, 'center');
         }
        plan_row = plan_row + 1;
    }



    for (var i = 0; i < headerArray.length; i++){
        var col = i + 1;
        sheet1.border(col, 7, {left:'thin',top:'thin',right:'thin',bottom:'thin'});
        sheet1.set(col, 7, headerArray[i].text);
        sheet1.fill(col, 7, {type:'solid', fgColor: headerArray[i].bgcolor});
        sheet1.wrap(col, 7, 'true');
        sheet1.align(col, 7, 'center');

    }

    var row = 8;
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

    sheet1.width(1,21);
    sheet1.width(2,20);
    sheet1.width(3,25);
    sheet1.width(4,20);
    sheet1.width(5,24);
    sheet1.width(6,25);
    sheet1.width(7,16);

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
