<?php

$filePath = "./data.json";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST');

if( $_GET['action'] == 'load' )
{
    $data = file_get_contents($filePath);
    echo json_encode($data);
}
else if( $_GET['action'] == 'save' && !empty($_POST['data']) )
{
    echo "first: file saved";
    var_dump($_POST['data']);
    file_put_contents( $filePath, $_POST['data'] );
}
