app.service('Utils', function($q, $http, $uibModal){

    this.handleError = function(err){
        console.error("This Error has occured", err);
    };

    this.camelizeString = function(inStr){
        var str = inStr.replace(/[_-]/g, " "), result = [];
        str = str.split(' ');
        str.forEach(function(s){
            result.push(s[0].toUpperCase() + s.substr(1));
        });
        result = result.join(' ');
        return result;
    };

    this.removeLastWord = function(str){
        var res = str.split(" ");
        res.pop();
        return res.join(" ");
    };

    this.createDate = function(dtObj){
        if(!dtObj){
            return '';
        }
        var result = new Date(dtObj);
        // result.setFullYear(dtObj.year);
        // result.setMonth(dtObj.monthValue);
        // result.setDate(dtObj.dayOfMonth);

        return result;
    };

    this.GetDPDate = function(dt){
        if(!dt){
            return '';
        }
        dt = new Date(dt);
        return (dt.getUTCMonth()+1) + '-' + dt.getDate() + '-' + dt.getFullYear();
    };


    //All Application Utility Dialogues and Modals to launch from here.

    this.CreateConfirmModal = function (title, quest, ok, cancel) {

        return $uibModal.open({
            templateUrl: 'confirm.tpl.html',
            controller: 'ConfirmDialogueCtrl',
            size: 'md',
            resolve: {
                items: function () {
                    return {
                        Title: title,
                        Question: quest,
                        Actions: {
                            Ok: ok,
                            Cancel: cancel
                        }
                    };
                }
            }
        });
    };

    this.CreateSelectListView = function (name, data, headers, cols) {

        return $uibModal.open({
            templateUrl: 'multiselectlist.tpl.html',
            controller: 'SelectListCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        Title: name || '',
                        Headers: headers,
                        Columns: cols,
                        List: data
                    };
                }
            }
        });
    };

});