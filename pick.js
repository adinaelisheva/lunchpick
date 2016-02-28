(function() {
    var app = angular.module( 'lunchpick', [] );

    app.controller( 'lunchCtrl', function( $scope, $http ) { 

	var nextId = 0;
	
	var setupAutocomplete = function(json){
        json = JSON.parse(json);
        $('.autocomplete').autocomplete({
            source: json,
            select: function(event, ui) {
                $scope.typedpick = ui.item.value;
            }
        });
    }
    
    $.get("/lunchpick/fetchuniquepicks.php",null,setupAutocomplete);

	//AJAX methods
	var fetchPeople = function(){
	    $http.get("/lunchpick/fetchnames.php").success(function(json){
		for( var i = 0; i < json.length; i++){
		    if( json[i].id >= nextId ) {
			nextId = json[i].id + 1
		    }
		    var obj = {
			id: json[i].id,
			name: json[i].name,
			email: json[i].email
		    };
		    if(Number(json[i].selected)){
			$scope.selected = json[i].id;
		    }
		    $scope.people.push(obj);
		    $scope.editNames[json[i].id] = json[i].name;
		    $scope.editEmails[json[i].id] = json[i].email;
		}
		if(!$scope.selected && json.length > 0){
		    $scope.selected = $scope.people[0].id;
		}
	    });
	};

	var fetchHistory = function(){
	    $http.get("/lunchpick/fetchpicks.php").success(function(json){
		for( var i = 0; i < json.length; i++){
		    //do some simple date processing
		    var date = json[i].date;
		    var arr = date.split('-');
		    //remove leading 0s, drop year
		    date = String(Number(arr[1])) + '/' + String(Number(arr[2]));

		    var obj = {
			name: json[i].pick,
			date: date
		    };
		    $scope.history.push(obj);
		}
	    });
	};

	var fetchPick = function(){
	    $http.get("/lunchpick/fetchpick.php").success(function(json){
		if(json !== ''){
		    $scope.lunchpick = json;
		}
	    });
	};

	var addPerson = function(name,email){
	    $http.get("/lunchpick/addname.php?name="+name+"&email="+email+"&id="+nextId);
	    $scope.editNames[nextId] = name;
	    $scope.editEmails[nextId] = email;
	    $scope.people.push({name:name, email: email, id: nextId});
	    nextId++;
	};

	var editPerson = function(p){
	    var selected = 0;
	    if ( p.id === $scope.selected ){
		selected = 1;
	    }
	    $http.get("/lunchpick/editname.php?name="+p.name+"&email="+p.email+"&selected="+selected+"&id="+p.id);
	};
	var deletePerson = function(id){
	    $http.get("/lunchpick/deletename.php?id="+id);
	};

	var addPick = function(name){
	    if( name===undefined ){ name = ''; }
	    $http.get("/lunchpick/editpick.php?name="+name);
	};
	
	var updateSelect = function(oldP,newP){
        $http.get("/lunchpick/editname.php?name="+oldP.name+"&email="
            +oldP.email+"&selected=0&id="+oldP.id);
        $http.get("/lunchpick/editname.php?name="+newP.name+"&email="
            +newP.email+"&selected=1&id="+newP.id);
	};

	//set up all the controller data
	$scope.people = [];
	$scope.history = [];
	$scope.editNames = {};
	$scope.editEmails = {};
	$scope.deleteThings = {};
	$scope.newemail = "";
	fetchPeople();
	fetchPick();
	fetchHistory();

	$scope.updatePick = function() {
	    addPick($scope.typedpick);
	    $scope.lunchpick = $scope.typedpick;
	    $scope.editing = false;
	};

	$scope.editPick = function() {
	    $scope.editing = true;
	};

	$scope.showAdd = function() {
	    $scope.adding = true;
	    window.setTimeout( 
		function() {
		    $('#newname')[0].focus();
		},
		100);
	};

	$scope.showPrevious = function() {
	    $scope.previous = !$scope.previous;
	};

	$scope.addPerson = function() {
	    $scope.adding = false;
	    if($scope.newname){
		addPerson($scope.newname, $scope.newemail);
	    };
	    $scope.newname = $scope.newemail = "";
	};

	$scope.stopAddPerson = function() {
	    $scope.adding = false;
	};
	$scope.editPeople = function() {
	    if ( $scope.editingPeople ) {
    		$scope.stopEditPeople();
	    } else {
	    	$scope.editingPeople = true;
	    	this.oldSelected = $scope.selected;
	    }
	}
	var updateRecord = function(newname, newemail,i){
	    var changed = false;
	    if ( $scope.people[i].name !== newname ){
		changed = true;
		$scope.people[i].name = newname;
	    }
	    if ( $scope.people[i].email !== newemail ){
		changed = true;
		$scope.people[i].email = newemail;
	    }
	    if ( changed ) {
		editPerson($scope.people[i]);
	    }
	};
	
	var deleteRecord = function(id, i){
	    $scope.people.splice(i,1);
	    $scope.editNames[id] = undefined;
	    $scope.editEmails[id] = undefined;
	    deletePerson(id);
	};


	$scope.stopEditPeople = function() {
	    $scope.editingPeople = false;
	    var selInd = 0;
	    var oldSelect,newSelect;
	    //update our people object
	    //go backwards since we're deleting stuff 
	    for ( var i = $scope.people.length-1; i >= 0; i--){
            var name = $scope.people[i].name;
            var id = $scope.people[i].id;
            var newname = $scope.editNames[id];
            var newemail = $scope.editEmails[id];
            //save for later
            if ( id === $scope.selected ) {
                selInd = i;
                newSelect = $scope.people[i];
            }
            if ( id === this.oldSelected ){
                oldSelect = $scope.people[i];
            }
            if ( $scope.deleteThings[id] ){
                deleteRecord( id, i);
            } else {
                updateRecord( newname, newemail, i);
            }
	    }
	    if(!$scope.editNames[$scope.selected]){
            //we deleted that person
            if ( selInd >= $scope.people.length ) {
                selInd = $scope.people.length - 1;
            }
            $scope.selected = $scope.people[selInd].id;
            editPerson($scope.people[selInd]);
	    } else if ( this.oldSelected !== $scope.selected ){
	        updateSelect(oldSelect, newSelect);
	    }
	    //reset
	    $scope.deleteThings = {};
	    $scope.selectChanged = false;
	}
	$scope.deletePerson = function(id) {
	    $scope.deleteThings[id] = !$scope.deleteThings[id]
	}
	$scope.selectPerson = function(id) {
	    $scope.selected = id;
	}
    });

})();
