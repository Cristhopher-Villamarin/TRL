package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "criterios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Criterio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idcriterio")
    private Integer idCriterio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idnivel", nullable = false)
    private NivelTRL nivelTRL;

    @Column(name = "nombrecriterio", nullable = false, length = 100)
    private String nombreCriterio;

    @Column(name = "puntajecriterio", nullable = false)
    private Integer puntajeCriterio;

    @Column(name = "importancia", nullable = false, length = 5)
    private String importancia;

    @Column(name = "justificacion", nullable = false, length = 100)
    private String justificacion;

    @Column(name = "estadoevidencia", nullable = false, length = 20)
    private String estadoEvidencia;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false)
    private LocalDate fechaModificacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDate.now();
        fechaModificacion = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDate.now();
    }
}
