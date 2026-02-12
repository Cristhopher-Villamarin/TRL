package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenciaResponse {
    private Integer idEvidencia;
    private Integer idProyecto;
    private String nombreProyecto;
    private String archivoNombre;
    private String descripcion;
    private LocalDate fechaCarga;
    private String estadoEvidencia;
}
