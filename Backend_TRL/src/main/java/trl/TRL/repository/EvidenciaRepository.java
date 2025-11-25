package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.Evidencia;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {

    List<Evidencia> findByProyecto_IdProyecto(Integer idProyecto);

    Optional<Evidencia> findByIdEvidenciaAndProyecto_Usuario_IdUsuario(Integer idEvidencia, Integer idUsuario);
}
