package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proyecto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proyecto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idproyecto")
    private Integer idProyecto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idusuario")
    private Usuario usuario;
    
    @Column(name = "nombreproyecto", nullable = false)
    private String nombreProyecto;
    
    @Column(name = "tipoproyecto", nullable = false, length = 100)
    private String tipoProyecto;
    
    @Column(name = "responsable", nullable = false, length = 100)
    private String responsable;
    
    @Column(name = "tipologia", nullable = false, length = 25)
    private String tipologia;
    
    @Column(name = "area_investigacion", nullable = false, length = 100)
    private String areaInvestigacion;
    
    @Column(name = "duracionmeses", nullable = false)
    private Integer duracionMeses;
    
    @Column(name = "departamento", nullable = false, length = 100)
    private String departamento;
    
    @Column(name = "carrera", nullable = false, length = 100)
    private String carrera;
    
    @Column(name = "linea_investigacion", nullable = false)
    private String lineaInvestigacion;
}
