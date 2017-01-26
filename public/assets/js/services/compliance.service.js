app.service('ComplianceService', function(APIHandler){

	  this.GetSOXTPs = function(size, page){
	    size = size || 10;
	    page = page || 1;
	    return APIHandler.Get('compliance/soxtp?pagesize='+size+'&pageNumber='+page);
	  };

	  this.GetSOXTP = function(id){
	    return APIHandler.Get('compliance/soxtp/'+id);
	  };

	  this.AddSOXTP = function(){
	    return APIHandler.Post('compliance/soxtp/');
	  };

	  this.DeleteSOXTP = function(id){
	    return APIHandler.Delete('compliance/soxtp/' + id);
	  };

	  this.UpdateSOXTP = function(id, params){
	    return APIHandler.Put('compliance/soxtp/'+id, params);
	  };

	  this.GetSOXRCMs = function(size, page){
	    return APIHandler.Get('compliance/soxrcm?pagesize='+size+'&pageNumber='+page);
	  };

	  this.GetSOXRCM = function(id){
	    return APIHandler.Get('compliance/soxrcm/'+id);
	  };

	  this.AddSOXRCM = function(params){
	    return APIHandler.Post('compliance/soxrcm/'+params);
	  };

	  this.DeleteSOXRCM = function(id){
	    return APIHandler.Delete('compliance/soxrcm/'+id);
	  };

	  this.UpdateSOXRCM = function(id, params){
	    return APIHandler.Put('compliance/soxrcm/'+id, params);
	  };

	  this.GetSOXPRAs = function(size, page){
	      return APIHandler.Get('compliance/soxpra?pagesize='+size+'&pageNumber='+page);
	  };

	  this.GetSOXPRA = function(id){
	      return APIHandler.Get('compliance/soxpra/'+id);
	  };

	  this.AddSOXPRA = function(params){
	      return APIHandler.Post('compliance/soxpra/'+params);
	  };

	  this.DeleteSOXPRA = function(id){
	      return APIHandler.Delete('compliance/soxpra/'+id);
	  };

	  this.UpdateSOXPRA = function(id, params){
	      return APIHandler.Put('compliance/soxpra/'+id, params);
	  };

	  this.GetUsers = function(){
	    return APIHandler.Get('users');
	  };

	});

