package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import trl.TRL.model.Document;
import trl.TRL.repository.DocumentRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentProcessingService {

    private final DocumentRepository documentRepository;
    private final PythonIntegrationService pythonService;

    private final String uploadDir = "storage/uploads";

    public Document processNewDocument(MultipartFile file) throws IOException {
        // 1. Guardar archivo localmente
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = root.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        log.info("Archivo guardado localmente en: {}", filePath.toAbsolutePath());

        // 2. Crear registro en la tabla documents (la que usa TRL_Version2)
        Document doc = new Document();
        doc.setFilename(filename);
        doc.setOriginalPath(filePath.toAbsolutePath().toString());
        doc.setFileType(file.getContentType());
        doc.setFileSize((int) file.getSize());
        doc.setStatus("PENDING");
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());

        Document savedDoc = documentRepository.save(doc);

        // 3. Ejecutar análisis en segundo plano (vía Python)
        // Podríamos usar @Async aquí.
        new Thread(() -> {
            boolean success = pythonService.executeTRLAnalysis(savedDoc.getId(), filePath.toAbsolutePath().toString());
            if (success) {
                savedDoc.setStatus("COMPLETED");
                savedDoc.setProcessingCompletedAt(LocalDateTime.now());
            } else {
                savedDoc.setStatus("FAILED");
                savedDoc.setErrorMessage("Error durante el análisis de Python");
            }
            documentRepository.save(savedDoc);
        }).start();

        return savedDoc;
    }

    public Document getDocumentById(Integer id) {
        return documentRepository.findById(id).orElse(null);
    }

    public java.util.List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}
