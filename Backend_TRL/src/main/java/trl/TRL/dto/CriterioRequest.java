package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriterioRequest {

    private Integer idNivel;
    private String nombreCriterio;
    private Integer puntajeCriterio;
    private String importancia;
    private String justificacion;
    private String estadoEvidencia;
}
