package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import trl.TRL.dto.AuthResponse;
import trl.TRL.dto.LoginRequest;
import trl.TRL.dto.RegisterRequest;
import trl.TRL.model.Rol;
import trl.TRL.model.Usuario;
import trl.TRL.repository.RolRepository;
import trl.TRL.repository.UsuarioRepository;
import trl.TRL.security.JwtTokenProvider;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        if (!"Activa".equals(usuario.getCuentaActiva())) {
            throw new RuntimeException("Cuenta inactiva");
        }
        
        String token = jwtTokenProvider.generateToken(
                usuario.getCorreo(), 
                usuario.getRol().getNombreRol()
        );
        
        return new AuthResponse(
                token,
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
                usuario.getRol().getNombreRol()
        );
    }
    
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        
        Rol rolUsuario = rolRepository.findByNombreRol("USUARIO")
                .orElseThrow(() -> new RuntimeException("Rol USUARIO no encontrado"));
        
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setApellido(request.getApellido());
        nuevoUsuario.setCorreo(request.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(request.getContrasena()));
        nuevoUsuario.setRol(rolUsuario);
        nuevoUsuario.setCuentaActiva("Activa");
        
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        
        String token = jwtTokenProvider.generateToken(
                usuarioGuardado.getCorreo(),
                usuarioGuardado.getRol().getNombreRol()
        );
        
        return new AuthResponse(
                token,
                usuarioGuardado.getIdUsuario(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellido(),
                usuarioGuardado.getCorreo(),
                usuarioGuardado.getRol().getNombreRol()
        );
    }
}
