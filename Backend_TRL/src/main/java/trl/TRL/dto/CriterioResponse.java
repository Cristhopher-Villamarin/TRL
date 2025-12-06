package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriterioResponse {

    private Integer idCriterio;
    private Integer idNivel;
    private String nombreNivel;
    private String nombreCriterio;
    private Integer puntajeCriterio;
    private String importancia;
    private String justificacion;
    private String estadoEvidencia;
    private LocalDate fechaCreacion;
    private LocalDate fechaModificacion;
}
