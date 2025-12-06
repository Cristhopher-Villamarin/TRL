package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "niveltrl")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NivelTRL {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idnivel")
    private Integer idNivel;

    @Column(name = "numnivel", nullable = false)
    private Integer numNivel;

    @Column(name = "nomnivel", nullable = false, length = 50)
    private String nomNivel;

    @Column(name = "entorno", nullable = false, length = 20)
    private String entorno;

    @Column(name = "fase_desarrollo", nullable = false, length = 50)
    private String faseDesarrollo;

    @Column(name = "puntaje_minimo", nullable = false)
    private Integer puntajeMinimo;

    @Column(name = "descripciontrl", nullable = false, columnDefinition = "TEXT")
    private String descripcionTrl;
}
