function ajoutParticipant()
{
	var nom=document.getElementById('nom').value;
	var prenom=document.getElementById('prenom').value;
	var filiere=document.getElementById('filiere').value;
	
	maDiv = document.createElement("div");
	maDiv.innerHTML = '<div class="alert alert-info alert-dismissable fade in"> <div class="pull-left"><img width="40" src="img/profile-pics/5.jpg" alt=""></div><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><small class="text-muted">'+nom+' '+prenom+'</small><br><p>'+filiere+'</p></div>'; 
	
    document.getElementById('divParticipants').appendChild(maDiv);

}

function initModal()
{
	document.getElementById('nom').value='';
	document.getElementById('prenom').value='';
	document.getElementById('filiere').value='';

}