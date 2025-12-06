package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import trl.TRL.dto.CriterioRequest;
import trl.TRL.dto.CriterioResponse;
import trl.TRL.service.CriterioService;

import java.util.List;

@RestController
@RequestMapping("/api/criterios")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class CriterioController {

    private final CriterioService criterioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearCriterio(@RequestBody CriterioRequest request) {
        try {
            CriterioResponse response = criterioService.crearCriterio(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodosLosCriterios() {
        try {
            List<CriterioResponse> criterios = criterioService.obtenerTodosLosCriterios();
            return ResponseEntity.ok(criterios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nivel/{idNivel}")
    public ResponseEntity<?> obtenerCriteriosPorNivel(@PathVariable Integer idNivel) {
        try {
            List<CriterioResponse> criterios = criterioService.obtenerCriteriosPorNivel(idNivel);
            return ResponseEntity.ok(criterios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCriterioPorId(@PathVariable Integer id) {
        try {
            CriterioResponse criterio = criterioService.obtenerCriterioPorId(id);
            return ResponseEntity.ok(criterio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarCriterio(@PathVariable Integer id, @RequestBody CriterioRequest request) {
        try {
            CriterioResponse response = criterioService.actualizarCriterio(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarCriterio(@PathVariable Integer id) {
        try {
            criterioService.eliminarCriterio(id);
            return ResponseEntity.ok("Criterio eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
