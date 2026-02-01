# Desafíos y Limitaciones del Proyecto

Este documento detalla los principales retos técnicos encontrados durante el desarrollo de la aplicación y las soluciones implementadas, así como las funcionalidades planificadas que quedaron fuera del alcance de este MVP (Producto Mínimo Viable).

## Problemas encontrados durante el desarrollo

### 1. Información Estática y Actualización
Uno de los mayores desafíos al trabajar con Modelos de Lenguaje (LLMs) es que su conocimiento es estático y se limita a la fecha de su último entrenamiento. Para una herramienta de investigación de whitepapers, esto es insuficiente ya que se requiere acceso a información actualizada y específica.

**Solución:**
Se desarrolló una "herramienta" (tool) especializada que actúa como puente entre el usuario y la información actual:
*   Esta herramienta se ejecuta automáticamente cuando detecta un mínimo de palabras clave (keywords) necesarias en la consulta.
*   Si la consulta es muy vaga, el sistema solicita al usuario más información antes de proceder.
*   La herramienta se conecta directamente a la **API de arXiv** para buscar artículos recientes.
*   La respuesta obtenida es procesada posteriormente por **GPT-4** para analizar y presentar la información relevante.

### 2. Barrera del Idioma (Español vs. Inglés)
Al probar la aplicación en español, nos encontramos con que no se encontraban coincidencias. Esto se debe a que la API de arXiv está optimizada y diseñada para funcionar principalmente con términos en inglés.

**Solución:**
Implementamos un flujo de procesamiento intermedio transparente para el usuario:
1.  Cuando el usuario realiza una consulta en español, un modelo LLM (GPT-4) analiza la intención.
2.  El modelo extrae las palabras clave necesarias y las traduce internamente al inglés.
3.  Estas palabras clave en inglés se envían a la API de arXiv para garantizar resultados precisos.
4.  Finalmente, la información recuperada es procesada y sintetizada nuevamente por el modelo (GPT-3/4) para presentar la respuesta al usuario en su idioma.

### 3. Latencia y Tiempos de Espera
Las búsquedas y el procesamiento de grandes cantidades de texto pueden tardar varios segundos, lo que podría generar una mala experiencia de usuario si tuviera que esperar a que todo el proceso termine para ver algo.

**Solución:**
Toda la aplicación utiliza una arquitectura de **conexión por streaming** sobre HTTP/2.
*   Esto permite que la respuesta se vaya "imprimiendo" en pantalla en tiempo real a medida que llega la información desde la API y es procesada.
*   El usuario percibe una respuesta inmediata y fluida, reduciendo la sensación de espera.

---

## Limitaciones y Trabajo Futuro (Problemas no atacados en este MVP)

### Base de Conocimiento Persistente
Actualmente, la solución realiza búsquedas en el momento, pero no almacena la información para un uso profundo y continuado en sesiones largas.

**Plan Futuro:**
La intención es implementar una base de conocimiento dinámica:
*   Después de la búsqueda inicial, si el usuario desea seguir explorando los whitepapers encontrados, el sistema debería realizar una **indexación** de los artículos seleccionados.
*   Esto crearía una base de datos temporal con el contexto de esos documentos.
*   Las preguntas subsiguientes del usuario serían redirigidas a esta base de conocimiento, permitiendo respuestas mucho más precisas y contextualizadas sobre el contenido específico de los papers.

*Nota: Esta funcionalidad no fue incluida en la versión actual debido a limitaciones de tiempo.*
