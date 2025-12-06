package trl.TRL.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import trl.TRL.dto.NivelTRLRequest;
import trl.TRL.dto.NivelTRLResponse;
import trl.TRL.model.NivelTRL;
import trl.TRL.repository.NivelTRLRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NivelTRLService {

    private final NivelTRLRepository nivelTRLRepository;

    @Transactional
    public NivelTRLResponse crearNivelTRL(NivelTRLRequest request) {
        // Validar que no exista un nivel con el mismo número
        if (nivelTRLRepository.existsByNumNivel(request.getNumNivel())) {
            throw new RuntimeException("Ya existe un nivel TRL con el número " + request.getNumNivel());
        }

        NivelTRL nivelTRL = new NivelTRL();
        nivelTRL.setNumNivel(request.getNumNivel());
        nivelTRL.setNomNivel(request.getNomNivel());
        nivelTRL.setEntorno(request.getEntorno());
        nivelTRL.setFaseDesarrollo(request.getFaseDesarrollo());
        nivelTRL.setPuntajeMinimo(request.getPuntajeMinimo());
        nivelTRL.setDescripcionTrl(request.getDescripcionTrl());

        NivelTRL nivelGuardado = nivelTRLRepository.save(nivelTRL);

        return convertirAResponse(nivelGuardado);
    }

    public List<NivelTRLResponse> obtenerTodosLosNiveles() {
        return nivelTRLRepository.findAll().stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public NivelTRLResponse obtenerNivelPorId(Integer id) {
        NivelTRL nivel = nivelTRLRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nivel TRL no encontrado con ID: " + id));

        return convertirAResponse(nivel);
    }

    @Transactional
    public NivelTRLResponse actualizarNivelTRL(Integer id, NivelTRLRequest request) {
        NivelTRL nivel = nivelTRLRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nivel TRL no encontrado con ID: " + id));

        // Validar que no exista otro nivel con el mismo número
        if (!nivel.getNumNivel().equals(request.getNumNivel()) &&
                nivelTRLRepository.existsByNumNivel(request.getNumNivel())) {
            throw new RuntimeException("Ya existe un nivel TRL con el número " + request.getNumNivel());
        }

        nivel.setNumNivel(request.getNumNivel());
        nivel.setNomNivel(request.getNomNivel());
        nivel.setEntorno(request.getEntorno());
        nivel.setFaseDesarrollo(request.getFaseDesarrollo());
        nivel.setPuntajeMinimo(request.getPuntajeMinimo());
        nivel.setDescripcionTrl(request.getDescripcionTrl());

        NivelTRL nivelActualizado = nivelTRLRepository.save(nivel);

        return convertirAResponse(nivelActualizado);
    }

    @Transactional
    public void eliminarNivelTRL(Integer id) {
        if (!nivelTRLRepository.existsById(id)) {
            throw new RuntimeException("Nivel TRL no encontrado con ID: " + id);
        }

        nivelTRLRepository.deleteById(id);
    }

    private NivelTRLResponse convertirAResponse(NivelTRL nivel) {
        return new NivelTRLResponse(
                nivel.getIdNivel(),
                nivel.getNumNivel(),
                nivel.getNomNivel(),
                nivel.getEntorno(),
                nivel.getFaseDesarrollo(),
                nivel.getPuntajeMinimo(),
                nivel.getDescripcionTrl());
    }
}
