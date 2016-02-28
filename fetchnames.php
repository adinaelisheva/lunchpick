<?php
echo("[");

include("cnfg.php");

$result = mysqli_query($con,"SELECT * from people ORDER BY name");

$first = true;

while($result && $row = mysqli_fetch_array($result)){
    if( !$first ){
        echo ",";
    }
    echo '{"name":"'; 
    echo $row["name"];
    echo '","email":"';
    echo $row["email"];
    echo '","selected":"';
    echo $row["selected"];
    echo '","id":"';
    echo $row["id"];
    echo '"}';

    $first = false;
}

echo("]");
?>