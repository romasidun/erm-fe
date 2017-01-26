/**
 * Created by Precision on 03/01/2017.
 */

app.service('DashService', function(APIHandler){

    this.GetDashboard = function(){
        return APIHandler.Get('dashboard');
    };

    this.GetTasks = function(size, page){
        return APIHandler.Get('dashboard/tasks');
    };

    this.AddPolicy = function(params){
        return APIHandler.PostWithFile('policies', params);
    };

});
