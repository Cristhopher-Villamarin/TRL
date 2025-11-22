package trl.TRL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    
    public AuthResponse(String token, Integer idUsuario, String nombre, String apellido, String correo, String rol) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
    }
}
