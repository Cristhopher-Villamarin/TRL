package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final OkHttpClient client = new OkHttpClient();

    public String uploadFile(MultipartFile file, Integer idProyecto) throws IOException {
        // Generar nombre único para el archivo
        String timestamp = String.valueOf(System.currentTimeMillis());
        String originalFilename = file.getOriginalFilename();
        String fileName = timestamp + "-" + originalFilename;
        String filePath = "proyecto-" + idProyecto + "/" + fileName;

        // Construir URL de Supabase Storage
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filePath;

        // Crear request body
        RequestBody requestBody = RequestBody.create(
                file.getBytes(),
                MediaType.parse(file.getContentType()));

        // Crear request
        Request request = new Request.Builder()
                .url(uploadUrl)
                .post(requestBody)
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .addHeader("Content-Type", file.getContentType())
                .build();

        // Ejecutar request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException(
                        "Error al subir archivo a Supabase: " + response.code() + " - " + response.message());
            }

            // Retornar URL pública del archivo
            return getPublicUrl(filePath);
        }
    }

    public void deleteFile(String fileUrl) throws IOException {
        // Extraer el path del archivo desde la URL
        String filePath = extractFilePathFromUrl(fileUrl);

        // Construir URL de eliminación
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filePath;

        // Crear request
        Request request = new Request.Builder()
                .url(deleteUrl)
                .delete()
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .build();

        // Ejecutar request
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException(
                        "Error al eliminar archivo de Supabase: " + response.code() + " - " + response.message());
            }
        }
    }

    public String getPublicUrl(String filePath) {
        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + filePath;
    }

    private String extractFilePathFromUrl(String url) {
        // Extraer el path después de "/public/{bucket}/"
        String searchString = "/public/" + bucket + "/";
        int startIndex = url.indexOf(searchString);
        if (startIndex != -1) {
            return url.substring(startIndex + searchString.length());
        }
        throw new IllegalArgumentException("URL de archivo inválida");
    }
}
