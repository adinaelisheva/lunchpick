<?php
include("cnfg.php");

if(isset($_GET['name'])){
    //don't bother if there's no name
    $pick = mysqli_real_escape_string($con,$_GET['name']);

    $result = mysqli_query($con,"SELECT id FROM picks ORDER BY id DESC LIMIT 1;");
    if($result && $row = mysqli_fetch_array($result)){
        $id = $row['id'];
	mysqli_query($con,"UPDATE picks SET pick='$pick' WHERE id='$id';");
    }
}


?>