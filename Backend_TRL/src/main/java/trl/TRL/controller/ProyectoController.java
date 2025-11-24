package trl.TRL.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trl.TRL.dto.ProyectoRequest;
import trl.TRL.dto.ProyectoResponse;
import trl.TRL.service.ProyectoService;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ProyectoController {

    private final ProyectoService proyectoService;

    @PostMapping
    public ResponseEntity<?> crearProyecto(@RequestBody ProyectoRequest request) {
        try {
            ProyectoResponse response = proyectoService.crearProyecto(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> obtenerProyectos() {
        try {
            List<ProyectoResponse> proyectos = proyectoService.obtenerProyectosDelUsuario();
            return ResponseEntity.ok(proyectos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProyectoPorId(@PathVariable Integer id) {
        try {
            ProyectoResponse proyecto = proyectoService.obtenerProyectoPorId(id);
            return ResponseEntity.ok(proyecto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProyecto(@PathVariable Integer id, @RequestBody ProyectoRequest request) {
        try {
            ProyectoResponse response = proyectoService.actualizarProyecto(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProyecto(@PathVariable Integer id) {
        try {
            proyectoService.eliminarProyecto(id);
            return ResponseEntity.ok("Proyecto eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
