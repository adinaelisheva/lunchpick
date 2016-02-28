<?php
include("cnfg.php");

$result = mysqli_query($con,"SELECT pick,id FROM picks ORDER BY id DESC LIMIT 1 ");

if($result && $row = mysqli_fetch_array($result)){
    //there should be only one row anyway
    echo($row['pick']);
}

?>