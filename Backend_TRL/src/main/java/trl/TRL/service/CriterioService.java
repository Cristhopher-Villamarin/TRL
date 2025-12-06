package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trl.TRL.dto.CriterioRequest;
import trl.TRL.dto.CriterioResponse;
import trl.TRL.model.Criterio;
import trl.TRL.model.NivelTRL;
import trl.TRL.repository.CriterioRepository;
import trl.TRL.repository.NivelTRLRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CriterioService {

    private final CriterioRepository criterioRepository;
    private final NivelTRLRepository nivelTRLRepository;

    @Transactional
    public CriterioResponse crearCriterio(CriterioRequest request) {
        // Validar que el nivel TRL existe
        NivelTRL nivelTRL = nivelTRLRepository.findById(request.getIdNivel())
                .orElseThrow(() -> new RuntimeException("Nivel TRL no encontrado con ID: " + request.getIdNivel()));

        // Validar que no exista un criterio con el mismo nombre para este nivel
        if (criterioRepository.existsByNombreCriterioAndNivelTRL_IdNivel(
                request.getNombreCriterio(), request.getIdNivel())) {
            throw new RuntimeException("Ya existe un criterio con el nombre '" +
                    request.getNombreCriterio() + "' para este nivel TRL");
        }

        Criterio criterio = new Criterio();
        criterio.setNivelTRL(nivelTRL);
        criterio.setNombreCriterio(request.getNombreCriterio());
        criterio.setPuntajeCriterio(request.getPuntajeCriterio());
        criterio.setImportancia(request.getImportancia());
        criterio.setJustificacion(request.getJustificacion());
        criterio.setEstadoEvidencia(request.getEstadoEvidencia());

        Criterio criterioGuardado = criterioRepository.save(criterio);

        return convertirAResponse(criterioGuardado);
    }

    public List<CriterioResponse> obtenerTodosLosCriterios() {
        return criterioRepository.findAll().stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public List<CriterioResponse> obtenerCriteriosPorNivel(Integer idNivel) {
        return criterioRepository.findByNivelTRL_IdNivel(idNivel).stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public CriterioResponse obtenerCriterioPorId(Integer id) {
        Criterio criterio = criterioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Criterio no encontrado con ID: " + id));

        return convertirAResponse(criterio);
    }

    @Transactional
    public CriterioResponse actualizarCriterio(Integer id, CriterioRequest request) {
        Criterio criterio = criterioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Criterio no encontrado con ID: " + id));

        // Si se cambia el nivel TRL, validar que existe
        if (!criterio.getNivelTRL().getIdNivel().equals(request.getIdNivel())) {
            NivelTRL nuevoNivel = nivelTRLRepository.findById(request.getIdNivel())
                    .orElseThrow(() -> new RuntimeException("Nivel TRL no encontrado con ID: " + request.getIdNivel()));
            criterio.setNivelTRL(nuevoNivel);
        }

        criterio.setNombreCriterio(request.getNombreCriterio());
        criterio.setPuntajeCriterio(request.getPuntajeCriterio());
        criterio.setImportancia(request.getImportancia());
        criterio.setJustificacion(request.getJustificacion());
        criterio.setEstadoEvidencia(request.getEstadoEvidencia());

        Criterio criterioActualizado = criterioRepository.save(criterio);

        return convertirAResponse(criterioActualizado);
    }

    @Transactional
    public void eliminarCriterio(Integer id) {
        if (!criterioRepository.existsById(id)) {
            throw new RuntimeException("Criterio no encontrado con ID: " + id);
        }

        criterioRepository.deleteById(id);
    }

    private CriterioResponse convertirAResponse(Criterio criterio) {
        return new CriterioResponse(
                criterio.getIdCriterio(),
                criterio.getNivelTRL().getIdNivel(),
                criterio.getNivelTRL().getNomNivel(),
                criterio.getNombreCriterio(),
                criterio.getPuntajeCriterio(),
                criterio.getImportancia(),
                criterio.getJustificacion(),
                criterio.getEstadoEvidencia(),
                criterio.getFechaCreacion(),
                criterio.getFechaModificacion());
    }
}
