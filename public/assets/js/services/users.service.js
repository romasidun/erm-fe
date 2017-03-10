/**
 * Created by Roma on 03/09/2017.
 */

app.service('UsersService', function(APIHandler){

    this.Get = function(){
        return APIHandler.Get('users');
    };

    this.GetOne = function(id){
        return APIHandler.Get('users/' + id);
    };

    this.Post = function(params){
        return APIHandler.Post('users', params);
    };

    this.Delete = function(id){
        return APIHandler.Delete('users/'+id);
    };

    this.Put = function(id, params){
        return APIHandler.Put('users/'+id, params);
    };

});
