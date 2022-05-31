package com.app.backend.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUploadUtil {
	public static void saveFile(String uploadDir, String fileName, MultipartFile file) throws IOException {
		Path uploadPath = Paths.get(uploadDir);
		log.info("Sadrzaj gde cuva: {}", uploadPath.toString());
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}
		
		try (InputStream inputStream = file.getInputStream()) {
			Path filePath = uploadPath.resolve(fileName);
			log.info("Sacuvana je slika!, {}", filePath.toString());
			Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException ioe) {
			throw new IOException("Could not save image file: " + fileName, ioe);
		}
		
	}
}
