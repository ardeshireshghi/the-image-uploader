<?php

header('content-type:application/json');
header('access-control-allow-origin:*');
$uploadsDir = '/uploads';
$savePaths = array();
foreach ($_FILES as $file) {

    if ($file['error'] == UPLOAD_ERR_OK) {
        $tmpName = $file["tmp_name"];
        $name = $file["name"];
        $savePath = "$uploadsDir/$name";
        move_uploaded_file($tmpName, __DIR__ . $savePath);
        $savePaths[] = $savePath;
    }
}

print json_encode(array('paths' => $savePaths));

