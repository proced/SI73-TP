<?php ob_start();
$fromemail="No-Reply <you@mail.com>"; // From Email Address (Just to recognise)
$toemail="rushenn@live.com"; // Receivers Email Address
$sub="Message from BodyFolio"; // Subject to appear in the Email

if($_SERVER['REQUEST_METHOD']=="POST") {
	$name=str_replace ( array("\n"), array("<br>"),trim($_REQUEST['name']));  
	$email=str_replace ( array("\n"), array("<br>"),trim($_REQUEST['email']));
	$purpose=str_replace ( array("\n"), array("<br>"),trim($_REQUEST['purpose']));  	
	$message=str_replace ( array("\n"), array("<br>"),trim($_REQUEST['message']));  
	
	// Message Body. I'm using a Table view, If you want you can remove it but keep the variables alive.
	$contentmsg=stripslashes("<br><b><font style=color:#CC3300>$sub</font></b><br>
	<table width=550 border=0 cellpadding=2 cellspacing=1 bgcolor=#CCCCCC>
		<tr>
			<td width=100 align=left valign=top bgcolor=#FFFFFF><B>Name:</b> </td>
			<td width=450 align=left valign=top bgcolor=#FFFFFF>$name</td>
		</tr>
		<tr>
			<td width=165 align=left valign=top bgcolor=#FFFFFF><B>Email:</b> </td>
			<td width=565 align=left valign=top bgcolor=#FFFFFF>$email</td>
		</tr>
		<tr>
			<td width=165 align=left valign=top bgcolor=#FFFFFF><B>Purpose:</b> </td>
			<td width=565 align=left valign=top bgcolor=#FFFFFF>$purpose</td>
		</tr>
		<tr>
			<td width=165 align=left valign=top bgcolor=#FFFFFF><B>Message:</b> </td>
			<td width=565 align=left valign=top bgcolor=#FFFFFF>$message</td>
		</tr>
	</table>
	");

	// Change this only if you have an idea
	$headers  = "MIME-Version: 1.0
";
	$headers .= "Content-type: text/html; charset=iso-8859-1
";					
	$headers .= "From: ".$fromemail." ";
	
	// Thank you message;
	$thanks = "<div class='thanks'><h3>Thank you!</h3><p class='pull-left'>Your message submitted successfully. We will try to reply you as soon as possible. For an urgent reply, please call us using the numbers mentioned here.</p></div>";
	
	// Let us send the message
	if(@mail($toemail,$sub,$contentmsg,$headers)) {
		echo $thanks;
	} else {
		echo "<p class='pull-left'>There was a problem sending your email.</p>";
	}

}
?>

