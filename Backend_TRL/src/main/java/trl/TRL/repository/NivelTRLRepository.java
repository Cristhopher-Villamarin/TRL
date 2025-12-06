package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.NivelTRL;

import java.util.Optional;

@Repository
public interface NivelTRLRepository extends JpaRepository<NivelTRL, Integer> {

    Optional<NivelTRL> findByNumNivel(Integer numNivel);

    boolean existsByNumNivel(Integer numNivel);
}
