package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import trl.TRL.model.Document;
import trl.TRL.service.DocumentProcessingService;

import java.io.IOException;

@RestController
@RequestMapping("/api/trl")
@RequiredArgsConstructor
public class TRLController {

    private final DocumentProcessingService documentProcessingService;

    @PostMapping("/analyze")
    public ResponseEntity<Document> analyzeDocument(@RequestParam("file") MultipartFile file) throws IOException {
        Document doc = documentProcessingService.processNewDocument(file);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/documents")
    public ResponseEntity<java.util.List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentProcessingService.getAllDocuments());
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Integer id) {
        Document doc = documentProcessingService.getDocumentById(id);
        if (doc != null) {
            return ResponseEntity.ok(doc);
        }
        return ResponseEntity.notFound().build();
    }
}
