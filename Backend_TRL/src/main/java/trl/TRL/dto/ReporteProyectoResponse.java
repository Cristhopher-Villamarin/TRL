package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteProyectoResponse {
    private Integer idReporte;
    private Integer idProyecto;
    private String nombreArchivo;
    private LocalDateTime fechaCreacion;
}
