package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trl.TRL.dto.ReporteProyectoResponse;
import trl.TRL.model.Proyecto;
import trl.TRL.model.ReporteProyecto;
import trl.TRL.repository.ProyectoRepository;
import trl.TRL.repository.ReporteProyectoRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteProyectoService {

    private final ReporteProyectoRepository reporteRepository;
    private final ProyectoRepository proyectoRepository;

    @Transactional
    public void guardarReporteDesdeArchivo(Integer idProyecto, String filePath) throws IOException {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Path path = Paths.get(filePath);
        byte[] data = Files.readAllBytes(path);

        ReporteProyecto reporte = new ReporteProyecto();
        reporte.setProyecto(proyecto);
        reporte.setNombreArchivo(path.getFileName().toString());
        reporte.setTipoArchivo("application/pdf");
        reporte.setArchivoDatos(data);

        reporteRepository.save(reporte);
    }

    @Transactional(readOnly = true)
    public List<ReporteProyectoResponse> obtenerReportesPorProyecto(Integer idProyecto) {
        return reporteRepository.findByProyecto_IdProyecto(idProyecto).stream()
                .map(r -> new ReporteProyectoResponse(
                        r.getIdReporte(),
                        r.getProyecto().getIdProyecto(),
                        r.getNombreArchivo(),
                        r.getFechaCreacion()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReporteProyecto obtenerArchivoReporte(Integer idReporte) {
        return reporteRepository.findById(idReporte)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
    }
}
