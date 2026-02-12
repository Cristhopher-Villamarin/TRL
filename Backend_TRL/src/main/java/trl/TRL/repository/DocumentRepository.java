package trl.TRL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trl.TRL.model.Document;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findByStatus(String status);

    List<Document> findByFilenameContaining(String filename);
}
