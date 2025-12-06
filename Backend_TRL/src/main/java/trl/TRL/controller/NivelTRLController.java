package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import trl.TRL.dto.NivelTRLRequest;
import trl.TRL.dto.NivelTRLResponse;
import trl.TRL.service.NivelTRLService;

import java.util.List;

@RestController
@RequestMapping("/api/niveles-trl")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class NivelTRLController {

    private final NivelTRLService nivelTRLService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearNivelTRL(@RequestBody NivelTRLRequest request) {
        try {
            NivelTRLResponse response = nivelTRLService.crearNivelTRL(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> obtenerTodosLosNiveles() {
        try {
            List<NivelTRLResponse> niveles = nivelTRLService.obtenerTodosLosNiveles();
            return ResponseEntity.ok(niveles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerNivelPorId(@PathVariable Integer id) {
        try {
            NivelTRLResponse nivel = nivelTRLService.obtenerNivelPorId(id);
            return ResponseEntity.ok(nivel);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarNivelTRL(@PathVariable Integer id, @RequestBody NivelTRLRequest request) {
        try {
            NivelTRLResponse response = nivelTRLService.actualizarNivelTRL(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarNivelTRL(@PathVariable Integer id) {
        try {
            nivelTRLService.eliminarNivelTRL(id);
            return ResponseEntity.ok("Nivel TRL eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
