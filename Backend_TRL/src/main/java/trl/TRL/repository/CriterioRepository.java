package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.Criterio;

import java.util.List;

@Repository
public interface CriterioRepository extends JpaRepository<Criterio, Integer> {

    List<Criterio> findByNivelTRL_IdNivel(Integer idNivel);

    boolean existsByNombreCriterioAndNivelTRL_IdNivel(String nombreCriterio, Integer idNivel);
}
