/**
 * Created by Roma on 03/09/2017.
 */

app.service('RolesService', function(APIHandler){

    this.Get = function(){
        return APIHandler.Get('roles');
    };

    this.Post = function(params){
        return APIHandler.Post('roles', params);
    };

    this.Delete = function(id){
        return APIHandler.Delete('roles/'+id);
    };

    this.Put = function(id, params){
        return APIHandler.Put('roles/'+id, params);
    };

});
