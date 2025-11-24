package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProyectoRequest {

    private String nombreProyecto;
    private String tipoProyecto;
    private String responsable;
    private String tipologia;
    private String areaInvestigacion;
    private Integer duracionMeses;
    private String departamento;
    private String carrera;
    private String lineaInvestigacion;
}
