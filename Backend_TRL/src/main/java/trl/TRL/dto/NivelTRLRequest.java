package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NivelTRLRequest {

    private Integer numNivel;
    private String nomNivel;
    private String entorno;
    private String faseDesarrollo;
    private Integer puntajeMinimo;
    private String descripcionTrl;
}
