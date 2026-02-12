package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.ReporteProyecto;

import java.util.List;

@Repository
public interface ReporteProyectoRepository extends JpaRepository<ReporteProyecto, Integer> {
    List<ReporteProyecto> findByProyecto_IdProyecto(Integer idProyecto);
}
