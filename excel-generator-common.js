var excelbuilder = require('msexcel-builder-colorfix');

function excelGenerator(path, data, callback) {
    // Create a new workbook file in current working-path
    var workbook = excelbuilder.createWorkbook(path, data.filename);

    // Create a new worksheet with 30 columns and 30 rows
    var sheet = workbook.createSheet(data.sheetName, data.cols, data.rows);

    for (var i in data.widths) {
        sheet.width(data.widths[i].col, data.widths[i].width);
    }

    for (var i in data.heights) {
        sheet.height(data.heights[i].row, data.heights[i].height);
    }

    for (var i in data.body) {
        var cell = data.body[i];
        if (typeof cell.merge == 'object') sheet.merge(cell.merge.to, cell.merge.from); //cell.merge = { to : { col: x, row: y }, from : { col: x1, row: y1 } }

        sheet.set(cell.col, cell.row, cell.text);    //cell.text = string

        cell.font = cell.font || { name: 'Calibri', sz: '13', family: '1', scheme: '-'};
        sheet.font(cell.col, cell.row, cell.font);  //cell.font = { name: 'Calibri', sz: '18', family: '3', scheme: '-', bold: 'true' }

        cell.valign = cell.valign || 'middle';
        sheet.valign(cell.col, cell.row, cell.valign);  //cell.valign = top, middle, bottom

        cell.align = cell.align || 'center';
        sheet.align(cell.col, cell.row, cell.align);  //cell.align = left, center, right

        cell.fill = cell.fill || { type: 'solid', fgColor: 'FFFFFF' };
        sheet.fill(cell.col, cell.row, cell.fill);   //cell.fill = { type: 'solid', fgColor: 'BFBFBF' }

        sheet.border(cell.col, cell.row, cell.border); //cell.border = { left: 'thin', top: 'thin', right: 'thin', bottom: 'thin' }

        sheet.wrap(cell.col, cell.row, cell.wrap);  //cell.wrap = true or false
    }

    // Save it
    workbook.save(function (err) {
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