import psycopg2
from config.settings import DATABASE_CONFIG

class DBManager:
    def __init__(self):
        self.conn_params = DATABASE_CONFIG

    def get_connection(self):
        return psycopg2.connect(**self.conn_params)

    def get_project_evidences(self, project_id):
        """Obtiene los archivos binarios de evidencias asociados a un proyecto"""
        conn = self.get_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT idevidencia, archivo_nombre, archivo_tipo, archivo_datos FROM evidencia WHERE idproyecto = %s", (project_id,))
        evidencias = cur.fetchall()
        
        cur.close()
        conn.close()
        return evidencias

    def get_trl_criteria(self):
        """Obtiene la matriz de criterios (Niveles y Evidencias) desde la DB"""
        conn = self.get_connection()
        cur = conn.cursor()
        
        # Obtener niveles
        cur.execute("SELECT numnivel, nomnivel, puntaje_minimo, descripciontrl FROM niveltrl ORDER BY numnivel")
        niveles = cur.fetchall()
        
        # Obtener criterios/evidencias
        cur.execute("SELECT idnivel, nombrecriterio, puntajecriterio, importancia, justificacion FROM criterios")
        criterios = cur.fetchall()
        
        cur.close()
        conn.close()
        
        # Formatear matrices para el prompt
        matriz_evidencias = ""
        for n in niveles:
            n_num = n[0]
            matriz_evidencias += f"\nTRL {n_num} - {n[1]}\n"
            matriz_evidencias += "| Evidencia | Puntaje | Importancia | Justificación |\n"
            for c in criterios:
                if c[0] == n_num:
                    matriz_evidencias += f"| {c[1]} | {c[2]} | {c[3]} | {c[4]} |\n"
        
        matriz_puntajes = ""
        for n in niveles:
            matriz_puntajes += f"TRL {n[0]}: {n[2]} puntos m\u00ednimos\n"
            
        return matriz_evidencias, matriz_puntajes

db_manager = DBManager()
