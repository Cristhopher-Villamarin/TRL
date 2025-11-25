package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import trl.TRL.dto.EvidenciaResponse;
import trl.TRL.model.Evidencia;
import trl.TRL.model.Proyecto;
import trl.TRL.model.Usuario;
import trl.TRL.repository.EvidenciaRepository;
import trl.TRL.repository.ProyectoRepository;
import trl.TRL.repository.UsuarioRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvidenciaService {

    private final EvidenciaRepository evidenciaRepository;
    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
    private final StorageService storageService;

    @Transactional
    public EvidenciaResponse subirEvidencia(Integer idProyecto, MultipartFile file, String descripcion,
            String estadoEvidencia) throws IOException {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el proyecto existe y pertenece al usuario
        Proyecto proyecto = proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

        // Subir archivo a Supabase Storage
        String fileUrl = storageService.uploadFile(file, idProyecto);

        // Crear evidencia en base de datos
        Evidencia evidencia = new Evidencia();
        evidencia.setProyecto(proyecto);
        evidencia.setUrl(fileUrl);
        evidencia.setDescripcion(descripcion);
        evidencia.setFechaCarga(LocalDate.now());
        evidencia.setEstadoEvidencia(estadoEvidencia);

        Evidencia evidenciaGuardada = evidenciaRepository.save(evidencia);
        return convertirAResponse(evidenciaGuardada);
    }

    @Transactional(readOnly = true)
    public List<EvidenciaResponse> obtenerEvidenciasDelProyecto(Integer idProyecto) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el proyecto pertenece al usuario
        proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

        List<Evidencia> evidencias = evidenciaRepository.findByProyecto_IdProyecto(idProyecto);
        return evidencias.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EvidenciaResponse obtenerEvidenciaPorId(Integer idEvidencia) {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Evidencia evidencia = evidenciaRepository
                .findByIdEvidenciaAndProyecto_Usuario_IdUsuario(idEvidencia, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada o no autorizada"));

        return convertirAResponse(evidencia);
    }

    @Transactional
    public void eliminarEvidencia(Integer idEvidencia) throws IOException {
        String correo = getCorreoFromAuthentication();
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Evidencia evidencia = evidenciaRepository
                .findByIdEvidenciaAndProyecto_Usuario_IdUsuario(idEvidencia, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada o no autorizada"));

        // Eliminar archivo de Supabase Storage
        storageService.deleteFile(evidencia.getUrl());

        // Eliminar registro de base de datos
        evidenciaRepository.delete(evidencia);
    }

    private String getCorreoFromAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private EvidenciaResponse convertirAResponse(Evidencia evidencia) {
        return new EvidenciaResponse(
                evidencia.getIdEvidencia(),
                evidencia.getProyecto().getIdProyecto(),
                evidencia.getProyecto().getNombreProyecto(),
                evidencia.getUrl(),
                evidencia.getDescripcion(),
                evidencia.getFechaCarga(),
                evidencia.getEstadoEvidencia());
    }
}
