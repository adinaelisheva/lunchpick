<?php
include("cnfg.php");

if(isset($_GET['name'])){
    //don't bother if there's no name
    $name = mysqli_real_escape_string($con,$_GET['name']);
    $email = mysqli_real_escape_string($con,$_GET['email']);

    mysqli_query($con,"INSERT INTO people (name,email) VALUES ('$name','$email')");

}


?>