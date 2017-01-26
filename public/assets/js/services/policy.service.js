/**
 * Created by Precision on 03/01/2017.
 */

app.service('PolicyService', function(APIHandler){

    this.GetPolicies = function(size, page){
        return APIHandler.Get('policies?pagesize=' + size + '&page=' + page);
    };

    this.GetPolicy = function(id){
        return APIHandler.Get('policies/' + id);
    };

    this.AddPolicy = function(params){
        return APIHandler.Post('policies', params);
    };

    this.DeletePolicy = function(id){
        return APIHandler.Delete('policies/'+id);
    };

    this.UpdatePolicy = function(id, params){
        return APIHandler.Put('policies/'+id, params);
    };

    this.GetAssessTypes = function(){
        return APIHandler.Get('assessmenttypes');
    };

});
