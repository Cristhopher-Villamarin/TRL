package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import trl.TRL.dto.EvidenciaResponse;
import trl.TRL.service.EvidenciaService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class EvidenciaController {

    private final EvidenciaService evidenciaService;

    @PostMapping("/proyectos/{idProyecto}/evidencias")
    public ResponseEntity<?> subirEvidencia(
            @PathVariable Integer idProyecto,
            @RequestParam("file") MultipartFile file,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("estadoEvidencia") String estadoEvidencia) {
        try {
            EvidenciaResponse response = evidenciaService.subirEvidencia(idProyecto, file, descripcion,
                    estadoEvidencia);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/proyectos/{idProyecto}/evidencias")
    public ResponseEntity<?> obtenerEvidencias(@PathVariable Integer idProyecto) {
        try {
            List<EvidenciaResponse> evidencias = evidenciaService.obtenerEvidenciasDelProyecto(idProyecto);
            return ResponseEntity.ok(evidencias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/evidencias/{id}")
    public ResponseEntity<?> obtenerEvidenciaPorId(@PathVariable Integer id) {
        try {
            EvidenciaResponse evidencia = evidenciaService.obtenerEvidenciaPorId(id);
            return ResponseEntity.ok(evidencia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/evidencias/{id}")
    public ResponseEntity<?> eliminarEvidencia(@PathVariable Integer id) {
        try {
            evidenciaService.eliminarEvidencia(id);
            return ResponseEntity.ok("Evidencia eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/evidencias/{id}/archivo")
    public ResponseEntity<byte[]> descargarEvidencia(@PathVariable Integer id) {
        try {
            trl.TRL.model.Evidencia evidencia = evidenciaService.obtenerArchivoEvidencia(id);
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + evidencia.getArchivoNombre() + "\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType(evidencia.getArchivoTipo()))
                    .body(evidencia.getArchivoDatos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
