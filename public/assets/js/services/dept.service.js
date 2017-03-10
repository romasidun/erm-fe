/**
 * Created by Roma on 03/09/2017.
 */

app.service('DeptService', function(APIHandler){

    this.Get = function(){
        return APIHandler.Get('depts');
    };

    this.GetOne = function(id){
        return APIHandler.Get('depts/' + id);
    };

    this.Post = function(params){
        return APIHandler.Post('depts', params);
    };

    this.Delete = function(id){
        return APIHandler.Delete('depts/'+id);
    };

    this.Put = function(id, params){
        return APIHandler.Put('depts/'+id, params);
    };

});
