package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "evidencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idevidencia")
    private Integer idEvidencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproyecto", nullable = false)
    private Proyecto proyecto;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "fecha_carga", nullable = false)
    private LocalDate fechaCarga;

    @Column(name = "estadoevidencia", nullable = false, length = 20)
    private String estadoEvidencia;
}
