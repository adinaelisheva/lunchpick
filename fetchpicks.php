<?php
include("cnfg.php");

$result = mysqli_query($con,"SELECT * FROM picks ORDER BY id DESC");

$first = true;

echo("[");

while($result && $row = mysqli_fetch_array($result)){
    //skip blank rows
    if( !$row['pick'] ) { continue; }

    if( !$first ){
        echo ",";
    }
    echo '{"pick":"'; 
    echo $row["pick"];
    echo '","date":"';
    echo $row["date_added"];
    echo '"}';

    $first = false;
}

echo("]");



?>