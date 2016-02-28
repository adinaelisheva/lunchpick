<?php

include("cnfg.php");

$result = mysqli_query($con,"SELECT pick,id FROM picks ORDER BY id DESC LIMIT 1 ");

if( $result && $row = mysqli_fetch_array($result)){
    if($row['pick'] == "") {
        die();
    }
} else {
    die();
}

//at this point we have row, and it has a valid input, so let's update everything

//move the selected forward one
$result = mysqli_query($con,"SELECT * from people ORDER BY name;");
$first = true;
$firstId = 0; //may need this
$next = false;
while($result && $row = mysqli_fetch_array($result)){
    if($first){
        $first = false;
        $firstId = $row['id'];
    }
    if($row['selected']){
        $next = true;
        $id = $row['id'];
        mysqli_query($con,"UPDATE people SET selected=0 WHERE id='$id';");
    } else if ($next) {
        $id = $row['id'];
        mysqli_query($con,"UPDATE people SET selected=1 WHERE id='$id';");
        $next=false;
        break;
    }
}
if($next){
    //we never updated, must have been the last entry
    mysqli_query($con,"UPDATE people SET selected=1 WHERE id='$firstId';");
}

//add new row to pick table
//necessary to use strtotime
date_default_timezone_set ( 'America/New_York' );
$date = strtotime('next friday');
$date = date("Y-m-d",$date);
mysqli_query($con,"INSERT INTO picks (date_added) VALUES ('$date');");

?>