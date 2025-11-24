package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.Proyecto;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {

    List<Proyecto> findByUsuario_IdUsuario(Integer idUsuario);

    Optional<Proyecto> findByIdProyectoAndUsuario_IdUsuario(Integer idProyecto, Integer idUsuario);
}
