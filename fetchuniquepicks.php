<?php
include("cnfg.php");

$result = mysqli_query($con,"SELECT DISTINCT pick FROM picks;");

$first = true;

echo("[");

while($result && $row = mysqli_fetch_array($result)){
    //skip blank rows
    if( !$row['pick'] ) { continue; }

    if( !$first ){
        echo ",";
    }
    echo '"'; 
    echo $row["pick"];
    echo '"';

    $first = false;
}

echo("]");



?>