<?php
if (isset($_POST['pieceFileName']) && isset($_FILES['pieceData'])) {
    $dir = "files";
    $name = $_POST['pieceFileName'];
    $index = intval($_POST['pieceIndex']);
    $total = intval($_POST['pieceTotal']);
    $tmp = "$dir/$name.$index";
    if (!is_dir($dir)) {
        mkdir($dir) || die(json_encode(array('status' => '1', 'msg' => 'create dir failed')));
    }
    if (@move_uploaded_file($_FILES['pieceData']['tmp_name'], $tmp) === false) {
        echo json_encode(array('status' => '1', 'msg' => 'move_uploaded_file error'));
        exit;
    }
    if ($index == $total - 1) {
        $target = "$dir/$name";
        if (file_exists($target)) unlink($target);
        $fp = fopen($target, "ab");
        for ($i = 0; $i < $total; $i++) {
            $tmp = "$dir/$name.$i";
            $handle = fopen($tmp, "rb");
            $size = filesize($tmp);
            if ($size > 0) {
                fwrite($fp, fread($handle, $size));
            }
            fclose($handle);
            unlink($tmp);
        }
        fclose($fp);
        echo json_encode(array('status' => '0'));
        exit;
    }
    echo json_encode(array('status' => '0'));
    exit;
}

echo json_encode(array('status' => '1', 'msg' => 'please use POST method'));
