package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "reporte_proyecto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteProyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreporte")
    private Integer idReporte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idproyecto", nullable = false)
    private Proyecto proyecto;

    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;

    @Column(name = "tipo_archivo")
    private String tipoArchivo;

    @Column(name = "archivo_datos")
    @JdbcTypeCode(SqlTypes.BINARY)
    private byte[] archivoDatos;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
