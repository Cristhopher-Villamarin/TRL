package trl.TRL.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Paths;

@Service
@Slf4j
@lombok.RequiredArgsConstructor
public class PythonIntegrationService {

    @Value("${python.executable:python}")
    private String pythonExecutable;

    private final String scriptsPath = Paths.get("python_scripts").toAbsolutePath().toString();

    public boolean executeTRLAnalysis(Integer docId, String filePath) {
        try {
            log.info("Iniciando ejecución de script Python para análisis TRL. DocID: {}", docId);

            ProcessBuilder pb = new ProcessBuilder(
                    pythonExecutable,
                    Paths.get(scriptsPath, "analyze_main.py").toString(),
                    "--file", filePath,
                    "--doc_id", docId.toString());

            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("[Python] " + line);
                }
            }

            int exitCode = process.waitFor();
            log.info("Script de Python finalizado con código: {}", exitCode);

            return exitCode == 0;
        } catch (Exception e) {
            log.error("Error al ejecutar el script de Python: ", e);
            return false;
        }
    }

    private final ReporteProyectoService reporteProyectoService;

    public boolean executeProjectAnalysis(Integer projectId) {
        try {
            log.info("Iniciando análisis global del proyecto ID: {}", projectId);

            ProcessBuilder pb = new ProcessBuilder(
                    pythonExecutable,
                    Paths.get(scriptsPath, "analyze_project.py").toString(),
                    "--project_id", projectId.toString());

            pb.redirectErrorStream(true);
            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("[Python-Project] " + line);
                }
            }

            int exitCode = process.waitFor();
            log.info("Script de análisis de proyecto finalizado con código: {}", exitCode);

            if (exitCode == 0) {
                // Guardar el reporte PDF en la base de datos
                String reportFileName = "analisis_proyecto_" + projectId + ".pdf";
                String reportPath = Paths.get("storage", "analysis", reportFileName).toAbsolutePath().toString();
                reporteProyectoService.guardarReporteDesdeArchivo(projectId, reportPath);
                return true;
            }

            return false;
        } catch (Exception e) {
            log.error("Error al ejecutar el análisis del proyecto en Python: ", e);
            return false;
        }
    }
}
