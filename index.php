<?php
	$pathToFile = $_SERVER['DOCUMENT_ROOT'].'/main.html';
	
	if (file_exists($pathToFile)) {
		$GetContentFile = file_get_contents($pathToFile);
		
		// Обработка контента
		
		echo $GetContentFile; // Вывод пользователю
	}
	else
		echo 'no file';
?>
