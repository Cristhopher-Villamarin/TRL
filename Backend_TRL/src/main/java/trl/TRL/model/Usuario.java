package trl.TRL.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusuario")
    private Integer idUsuario;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idrol", nullable = false)
    private Rol rol;
    
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;
    
    @Column(name = "correo", nullable = false, length = 50, unique = true)
    private String correo;
    
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;
    
    @Column(name = "cuenta_activa", nullable = false, length = 25)
    private String cuentaActiva;
}
