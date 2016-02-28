<?php
include("cnfg.php");

if(isset($_GET['id'])){
    //don't bother if there's no id
    $id = mysqli_real_escape_string($con,$_GET['id']);
    if(isset($_GET['name'])){
        $name = $_GET['name'];
    } else {
        $name = '';
    }
    if(isset($_GET['email'])){
        $email = $_GET['email'];
    } else {
        $email = '';
    }
    if(isset($_GET['selected']) && $_GET['selected']){
        $selected = 1;
    } else {
        $selected = 0;
    }


    mysqli_query($con,"UPDATE people SET name='$name',email='$email',selected='$selected' WHERE id='$id';");
}


?>