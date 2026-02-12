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

        @Transactional
        public EvidenciaResponse subirEvidencia(Integer idProyecto, MultipartFile file, String descripcion,
                        String estadoEvidencia) throws IOException {
                String correo = getCorreoFromAuthentication();
                Usuario usuario = usuarioRepository.findByCorreo(correo)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                Proyecto proyecto = proyectoRepository
                                .findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

                Evidencia evidencia = new Evidencia();
                evidencia.setProyecto(proyecto);
                evidencia.setArchivoNombre(file.getOriginalFilename());
                evidencia.setArchivoTipo(file.getContentType());
                evidencia.setArchivoDatos(file.getBytes());
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

                proyectoRepository.findByIdProyectoAndUsuario_IdUsuario(idProyecto, usuario.getIdUsuario())
                                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado o no autorizado"));

                List<Evidencia> evidencias = evidenciaRepository.findByProyecto_IdProyecto(idProyecto);
                return evidencias.stream()
                                .map(this::convertirAResponse)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public Evidencia obtenerArchivoEvidencia(Integer idEvidencia) {
                String correo = getCorreoFromAuthentication();
                Usuario usuario = usuarioRepository.findByCorreo(correo)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                return evidenciaRepository
                                .findByIdEvidenciaAndProyecto_Usuario_IdUsuario(idEvidencia, usuario.getIdUsuario())
                                .orElseThrow(() -> new RuntimeException("Evidencia no encontrada o no autorizada"));
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
                                evidencia.getArchivoNombre(),
                                evidencia.getDescripcion(),
                                evidencia.getFechaCarga(),
                                evidencia.getEstadoEvidencia());
        }
}
