package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trl.TRL.dto.ProyectoRequest;
import trl.TRL.dto.ProyectoResponse;
import trl.TRL.model.Proyecto;
import trl.TRL.model.Usuario;
import trl.TRL.repository.ProyectoRepository;
import trl.TRL.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ProyectoResponse crearProyecto(ProyectoRequest request) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = new Proyecto();
        proyecto.setUsuario(usuario);
        proyecto.setNombreProyecto(request.getNombreProyecto());
        proyecto.setTipoProyecto(request.getTipoProyecto());
        proyecto.setResponsable(request.getResponsable());
        proyecto.setTipologia(request.getTipologia());
        proyecto.setAreaInvestigacion(request.getAreaInvestigacion());
        proyecto.setDuracionMeses(request.getDuracionMeses());
        proyecto.setDepartamento(request.getDepartamento());
        proyecto.setCarrera(request.getCarrera());
        proyecto.setLineaInvestigacion(request.getLineaInvestigacion());

        Proyecto proyectoGuardado = proyectoRepository.save(proyecto);
        return convertirAResponse(proyectoGuardado);
    }

    @Transactional(readOnly = true)
    public List<ProyectoResponse> obtenerProyectosDelUsuario() {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Proyecto> proyectos = proyectoRepository.findByUsuario_IdUsuario(usuario.getIdUsuario());
        return proyectos.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProyectoResponse obtenerProyectoPorId(Integer idProyecto) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

        return convertirAResponse(proyecto);
    }

    @Transactional
    public ProyectoResponse actualizarProyecto(Integer idProyecto, ProyectoRequest request) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

        proyecto.setNombreProyecto(request.getNombreProyecto());
        proyecto.setTipoProyecto(request.getTipoProyecto());
        proyecto.setResponsable(request.getResponsable());
        proyecto.setTipologia(request.getTipologia());
        proyecto.setAreaInvestigacion(request.getAreaInvestigacion());
        proyecto.setDuracionMeses(request.getDuracionMeses());
        proyecto.setDepartamento(request.getDepartamento());
        proyecto.setCarrera(request.getCarrera());
        proyecto.setLineaInvestigacion(request.getLineaInvestigacion());

        Proyecto proyectoActualizado = proyectoRepository.save(proyecto);
        return convertirAResponse(proyectoActualizado);
    }

    @Transactional
    public void eliminarProyecto(Integer idProyecto) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

        proyectoRepository.delete(proyecto);
    }

    private String getCorreoFromAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private ProyectoResponse convertirAResponse(Proyecto proyecto) {
        return new ProyectoResponse(
                proyecto.getIdProyecto(),
                proyecto.getUsuario().getIdUsuario(),
                proyecto.getUsuario().getNombre() + " " + proyecto.getUsuario().getApellido(),
                proyecto.getNombreProyecto(),
                proyecto.getTipoProyecto(),
                proyecto.getResponsable(),
                proyecto.getTipologia(),
                proyecto.getAreaInvestigacion(),
                proyecto.getDuracionMeses(),
                proyecto.getDepartamento(),
                proyecto.getCarrera(),
                proyecto.getLineaInvestigacion());
    }
}
