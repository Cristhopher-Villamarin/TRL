package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvidenciaRequest {
    private String descripcion;
    private String estadoEvidencia;
}
