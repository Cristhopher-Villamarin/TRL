package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trl.TRL.dto.ReporteProyectoResponse;
import trl.TRL.model.ReporteProyecto;
import trl.TRL.service.ReporteProyectoService;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ReporteProyectoController {

    private final ReporteProyectoService reporteService;

    @GetMapping("/proyecto/{idProyecto}")
    public ResponseEntity<List<ReporteProyectoResponse>> listarReportes(@PathVariable Integer idProyecto) {
        return ResponseEntity.ok(reporteService.obtenerReportesPorProyecto(idProyecto));
    }

    @GetMapping("/{id}/descargar")
    public ResponseEntity<byte[]> descargarReporte(@PathVariable Integer id) {
        try {
            ReporteProyecto reporte = reporteService.obtenerArchivoReporte(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + reporte.getNombreArchivo() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(reporte.getArchivoDatos());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
