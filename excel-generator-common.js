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
        if (cell.merge) {
            sheet.merge(cell.merge.to, cell.merge.from); //cell.merge = { to : { col: x, row: y }, from : { col: x1, row: y1 } }

            if (cell.border) {
                for (var i = cell.merge.to.row; i <= cell.merge.from.row; i++) {
                    for (var j = cell.merge.to.col; j <= cell.merge.from.col; j++) {

                        var borderObj = {};

                        if(j == cell.merge.to.col)
                            borderObj.left = cell.border.left;

                        if(j == cell.merge.from.col)
                            borderObj.right = cell.border.right;

                        if(i == cell.merge.to.row)
                            borderObj.top = cell.border.top;

                        if(i == cell.merge.from.row)
                            borderObj.bottom = cell.border.bottom;

                        sheet.border(j, i, borderObj)
                    }
                }
            }
        }

        if (cell.text)
            sheet.set(cell.col, cell.row, cell.text);    //cell.text = string

        if (cell.font)
            sheet.font(cell.col, cell.row, cell.font);  //cell.font = { name: 'Calibri', sz: '18', family: '3', scheme: '-', bold: 'true' }

        cell.valign = cell.valign || 'center';
        sheet.valign(cell.col, cell.row, cell.valign);  //cell.valign = top, middle, bottom

        cell.align = cell.align || 'center';
        sheet.align(cell.col, cell.row, cell.align);  //cell.align = left, center, right

        if (cell.fill)
            sheet.fill(cell.col, cell.row, cell.fill);   //cell.fill = { type: 'solid', fgColor: 'BFBFBF' }

        if (cell.border && !cell.merge)
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