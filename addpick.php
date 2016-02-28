<?php
include("cnfg.php");

if(isset($_GET['name'])){
    //don't bother if there's no name
    $pick = mysqli_real_escape_string($con,$_GET['name']);

    //necessary to use strtotime
    date_default_timezone_set ( 'America/New_York' );
    $date = strtotime('next friday');
    $date = date("Y-m-d",$date);

    mysqli_query($con,"INSERT INTO picks (pick,date_added) VALUES ('$pick','$date')");

}


?>