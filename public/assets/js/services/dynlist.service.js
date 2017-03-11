/**
 * Created by Roma on 03/09/2017.
 */

app.service('DynListService', function(APIHandler){

    this.Get = function(){
        return APIHandler.Get('dynlists');
    };

    this.GetOne = function(id){
        return APIHandler.Get('dynlists/'+id);
    };

    this.Post = function(params){
        return APIHandler.Post('dynlists', params);
    };

    this.Delete = function(id){
        return APIHandler.Delete('dynlists/'+id);
    };

    this.Put = function(id, params){
        return APIHandler.Put('dynlists/'+id, params);
    };

    this.GetTypeList = function(){
        return APIHandler.Get('dynlisttypes');
    };

});
