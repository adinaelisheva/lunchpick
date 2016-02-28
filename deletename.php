<?php
include("cnfg.php");
if ( isset($_GET['id']) ){
   $id = $_GET["id"];
   echo("deleting $id");
   mysqli_query($con,"DELETE FROM people WHERE id='$id';");
}
?>