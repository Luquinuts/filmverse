**Universidad Atlántida Argentina**  
Facultad de Ingeniería  
Ingeniería de Software III

**FilmVerse**

**TP2 – Benchmarking**  
Elicitación

Versión: 1    |    Fecha de entrega: 14/04/2026

**Integrantes del Grupo 3**  
Metrailler Iván  
Galende Ramiro  
Palavecino Lucas

Profesora: Galia Carolina Serruya

**[1\. Introducción a la técnica	3](#heading=)**

[**2\. Listado de Competidores Identificados	4**](#heading=)

[**3\. Comparativa Funcional	5**](#heading=)

[**4\. Análisis Diferencial	6**](#heading=)

[4.1 Fortalezas del MVP	6](#heading=)

[4.2 Debilidades y gaps detectados	6](#heading=)

[**5\. Estándares del Mercado	7**](#heading=)

[**6\. Tendencias del Mercado	8**](#heading=)

[6.1 IA y chatbots como motor de descubrimiento	8](#heading=)

[6.2 Fragmentación del streaming y necesidad de agregadores	8](#heading=)

[6.3 Personalización extrema y datos propios	8](#heading=)

[6.4 Comunidades nicho y foco regional	8](#heading=)

[6.5 Interfaces conversacionales como nuevo paradigma UX	8](#heading=)

[**7\. Documento para Stakeholders	9**](#heading=)

[7.1 Panorama Competitivo	9](#heading=)

[7.2 Lo que los competidores hacen y FilmVerse no contempla	9](#heading=)

[7.3 Mínimo del Mercado	9](#heading=)

[7.4 Lo que el mercado está demandando hoy	9](#heading=)

[7.5 Evaluación del MVP Actual	10](#heading=)

[7.6 Recomendación / Conclusión Final	10](#heading=)

# 

# **1\. Introducción a la técnica**

La técnica de benchmarking es un proceso continuo de investigación y análisis comparativo que permite a las empresas comparar sus productos, servicios, procesos y rendimientos con los líderes del sector.

Nuestro objetivo con dicha técnica es obtener un análisis o resumen de las fortalezas y debilidades de nuestro proyecto con respecto a otras opciones disponibles en el mercado en el que nos desarrollamos.

También lo utilizaremos para dejar en consideración las funcionalidades a quitar o agregar en nuestro proyecto en base a la información obtenida.

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# 

# **2\. Listado de Competidores Identificados**

Se identificaron 10 soluciones relevantes del mercado, incluyendo competidores directos, indirectos y líderes del segmento. La tabla siguiente sintetiza sus características principales:

| Nombre | Tipo | Segmento | Posicionamiento | Plataformas | Diferencial clave |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **Letterboxd** | SaaS/Mobile | Cinéfilos | Freemium (Pro \~$19/año) | Web \+ iOS/Android | Red social de películas líder; listas y diarios |
| **Trakt.tv** | SaaS/Mobile | TV+Cine fans | Freemium (VIP $60/año) | Web \+ iOS/Android | Auto-scrobbling; ecosistema de 3eros vía API |
| **FilmAffinity** | Web/Mobile | Esp/Latam cinéfilos | Gratuito \+ ads | Web \+ iOS/Android | Fuerte en cine europeo y latinoamericano |
| **IMDb** | SaaS/Mobile | Público masivo | Gratuito \+ IMDb Pro | Web \+ iOS/Android | Mayor base de datos; propiedad de Amazon |
| **Simkl** | SaaS/Mobile | TV+Anime+Cine | Freemium (VIP) | Web \+ iOS/Android | Auto-tracking; cubre anime y dramas asiáticos |
| **JustWatch** | SaaS/Mobile | Espectadores streaming | Gratuito | Web \+ iOS/Android | Agrega \+100 servicios; dónde ver cada título |
| **TV Time** | Mobile-first | Fans de series | Gratuito \+ anuncios | Web \+ iOS/Android | Foco en episodios; comunidad de episodios |
| **Reelgood** | SaaS/Mobile | Usuarios streaming | Freemium | Web \+ iOS/Android | Búsqueda unificada entre servicios de streaming |
| **Criticker** | Web | Cinéfilos avanzados | Gratuito | Solo Web | Algoritmo sofisticado de compatibilidad de gustos |
| **Serializd** | Mobile-first | Fans de series | Gratuito | Web \+ iOS/Android | Letterboxd para series; muy joven y en crecimiento |
| **FilmVerse** | Web (prototipo) | Cinéfilos en español | Gratuito (MVP) | Web (móvil a futuro) | Chatbot IA \+ dashboard \+ enfoque en Latam |

*(\*) FilmVerse — versión web como objeto de prototipado; móvil como requisito a futuro.*

# **3\. Comparativa Funcional**

La siguiente tabla compara las funcionalidades clave del mercado contra cada solución relevada. El fondo verde (SI) indica que la funcionalidad está presente; el fondo rojo (NO) indica ausencia

| Funcionalidad | Letterboxd | Trakt.tv | FilmAff. | IMDb | Simkl | JustWatch | TV Time | Reelgood | Criticker | Serializd | FilmVerse |
| ----- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Registro películas vistas** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **SI** |
| **Lista pendientes (watchlist)** | **SI** | **SI** | **NO** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **SI** |
| **Calificación / rating** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **SI** | **SI** | **SI** | **SI** | **SI** |
| **Reseñas / críticas de usuario** | **SI** | **NO** | **SI** | **SI** | **NO** | **NO** | **SI** | **NO** | **SI** | **NO** | **SI** |
| **Recomendaciones personalizadas** | **NO** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **SI** | **SI** | **NO** | **SI** |
| **Chatbot / IA conversacional** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **SI** |
| **Dashboard estadísticas personales** | **SI** | **SI** | **NO** | **NO** | **SI** | **NO** | **NO** | **NO** | **NO** | **NO** | **SI** |
| **Seguimiento de usuarios (social)** | **SI** | **NO** | **SI** | **SI** | **SI** | **NO** | **SI** | **NO** | **SI** | **NO** | **SI** |
| **Listas compartidas / públicas** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **SI** | **NO** | **SI** | **NO** | **SI** |
| **Donde streamear (integración)** | **NO** | **NO** | **NO** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **NO** | **NO** |
| **Disponible en web** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** |
| **App móvil nativa** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **NO** | **NO** | **NO** |
| **Acceso gratuito base** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** | **SI** |
| **Cine latinoamericano destacado** | **NO** | **NO** | **SI** | **SI** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** | **SI** |

# **4\. Análisis Diferencial**

## **4.1 Fortalezas del MVP**

* **Chatbot con IA conversacional:** ningún competidor directo del segmento (Letterboxd, FilmAffinity, Simkl, Trakt) incorpora un chatbot integrado para consultas cinematográficas. Esta es la diferenciación más fuerte del MVP.

* **Dashboard de estadísticas personales:** solo Letterboxd Pro y Simkl ofrecen estadísticas comparables, y en ambos casos con fricción (Letterboxd requiere suscripción de pago; Simkl tiene UI compleja). FilmVerse lo incorpora como funcionalidad core gratuita.

* **Foco latinoamericano:** FilmAffinity tiene presencia en España y Latinoamérica, pero no fue diseñado pensando en la comunidad regional. FilmVerse puede posicionarse como la plataforma para cinéfilos hispanohablantes.

* **Integración de los tres pilares en un solo producto:** la combinación de IA \+ dashboard \+ interacciones sociales en una sola plataforma gratuita no existe hoy en el mercado de forma integrada.

## **4.2 Debilidades y gaps detectados**

* **Ausencia de integración con servicios de streaming:** JustWatch, Reelgood y Simkl muestran dónde se puede ver cada película. Esta funcionalidad es valorada por los usuarios y FilmVerse no la contempla en el MVP.

* **Sin auto-tracking:** Trakt.tv y Simkl se sincronizan automáticamente con Netflix, Plex y otras plataformas. FilmVerse requiere registro manual, lo que genera fricción en la adopción.

* **Sin app móvil en el MVP:** la mayoría de los competidores tienen apps nativas en iOS y Android. FilmVerse queda limitado a web en el alcance del proyecto, lo cual reduce la retención de usuarios habituales.

* **Base de datos propia vs. APIs consolidadas:** IMDb y TMDB tienen millones de títulos con metadatos enriquecidos. FilmVerse deberá definir su estrategia de datos (integración con TMDB API, por ejemplo) para no construir desde cero.

* **Comunidad inicial pequeña:** el valor de las plataformas sociales crece con la red. FilmVerse parte desde cero y deberá definir estrategias de adquisición de usuarios tempranos.

# **5\. Estándares del Mercado**

Las siguientes funcionalidades son consideradas obligatorias por la mayoría de los competidores relevados. Un producto que no las incluya enfrenta barreras de adopción significativas:

* **Registro de películas vistas:** presente en el 100% de los competidores directos. Es la funcionalidad mínima del segmento.

* **Listas de pendientes (watchlist)**: esperada por todos los usuarios del segmento. Ausente en FilmAffinity como funcionalidad explícita.

* **Sistema de calificación (rating):** universal. Los usuarios esperan poder puntuar lo que consumen como funcionalidad base.

* **Recomendaciones personalizadas:** presente en más del 70% de los competidores. Los usuarios esperan que la plataforma aprenda de sus gustos.

* **Acceso gratuito al núcleo funcional:** todos los competidores tienen una capa gratuita operativa. Los modelos premium son opcionales.

* **Disponibilidad web:** el 100% de los competidores tiene interfaz web. FilmVerse cumple este estándar en su MVP.

* **Perfil de usuario con historial visible:** los usuarios esperan poder ver su propio historial y compartirlo con otros.

# **6\. Tendencias del Mercado**

## **6.1 IA y chatbots como motor de descubrimiento**

Según un informe de Nielsen/Gracenote publicado en abril de 2026, el 49% de la Generación Alpha ya elige chatbots de IA como su primera fuente para recomendaciones de películas y series, superando a los buscadores tradicionales y a las interfaces de los servicios de streaming. El 66% de los usuarios encuestados reportó haber aumentado su uso de chatbots para entretenimiento en los últimos 18 meses. Esta tendencia valida directamente la apuesta de FilmVerse por integrar un chatbot como funcionalidad core.

## **6.2 Fragmentación del streaming y necesidad de agregadores**

Con más de 200 servicios de streaming disponibles globalmente, los usuarios se sienten abrumados al intentar encontrar dónde ver un título específico. Plataformas como JustWatch han capitalizado esta necesidad, alcanzando millones de usuarios mensuales. La integración de información de disponibilidad en streaming es cada vez más esperada por los usuarios de plataformas de seguimiento.

## **6.3 Personalización extrema y datos propios**

Los usuarios de plataformas de entretenimiento valoran cada vez más tener acceso a sus propias estadísticas de consumo. Letterboxd Pro y Simkl han incorporado dashboards personales como funcionalidades premium. La demanda de insights sobre el propio comportamiento de consumo (géneros favoritos, directores más vistos, horas de contenido, evolución en el tiempo) está en crecimiento.

## **6.4 Comunidades nicho y foco regional**

El mercado global está dominado por plataformas anglófonas. Existen oportunidades claras para productos con sensibilidad regional: FilmAffinity en España y Latinoamérica es el caso de referencia. La demanda de plataformas en español, con reconocimiento del cine latinoamericano y europeo, no está completamente satisfecha.

## **6.5 Interfaces conversacionales como nuevo paradigma UX**

Los chatbots basados en LLMs (Large Language Models) están redefiniendo la forma en que los usuarios interactúan con las aplicaciones. Prefieren hacer preguntas en lenguaje natural ('Dame una película de suspenso francesa de los años 90') antes que navegar por filtros complejos. Este cambio de paradigma favorece la propuesta de FilmVerse.

# **7\. Documento para Stakeholders**

## **7.1 Panorama Competitivo**

El mercado de plataformas de seguimiento cinematográfico está liderado por Letterboxd (red social de cine) y Trakt.tv (tracking automatizado), seguidos por FilmAffinity (presencia hispanohablante) e IMDb (base de datos masiva, propiedad de Amazon). Ninguno de estos actores tiene un chatbot con IA integrado como funcionalidad core.

El mercado no está saturado en el segmento hispanohablante: FilmAffinity es el único competidor relevante en español y tiene un producto envejecido en términos de UX y funcionalidades de IA. La ventana de oportunidad es concreta y acotada en el tiempo.

## **7.2 Lo que los competidores hacen y FilmVerse no contempla**

Tres funcionalidades estándar del mercado no están contempladas en el MVP actual y representan riesgos de adopción:

* **Sincronización con plataformas de streaming (Trakt, Simkl):** los usuarios no quieren registrar manualmente cada película. Esta fricción puede ser determinante en la retención.

* **Información de dónde ver cada película (JustWatch, IMDb, Reelgood):** es una consulta frecuente que los usuarios esperan resolver desde la misma plataforma.

* **Aplicación móvil nativa (todos los competidores top):** el uso móvil domina el tiempo de pantalla de ocio. Quedar solo en web limita significativamente la propuesta de valor en el uso cotidiano.

## **7.3 Mínimo del Mercado**

Para ser considerado un producto viable en este segmento, FilmVerse debe garantizar, en su versión productiva, las siguientes funcionalidades:

* Registro de películas vistas y lista de pendientes.

* Sistema de calificación y reseñas de usuarios.

* Recomendaciones personalizadas basadas en historial.

* Perfil público de usuario con historial visible.

* Acceso gratuito al núcleo funcional.

* Base de datos de películas actualizada y con metadatos completos.

## **7.4 Lo que el mercado está demandando hoy**

Tres señales claras definen lo que el mercado exige en 2026:

* **Interfaces conversacionales:** según Nielsen/Gracenote (abril 2026), el 49% de la Generación Alpha prefiere los chatbots de IA para descubrir qué ver. FilmVerse está alineado con esta tendencia y es el único actor del segmento que la contempla.

* **Personalización basada en datos propios:** los usuarios quieren ver estadísticas de su propio consumo, no solo rankings globales. El dashboard de FilmVerse responde a esta demanda.

* **Contenido regional y en idioma local:** la saturación de contenido global genera demanda de curaduría regional. Un producto con foco latinoamericano y en español tiene una posición diferenciada.

## **7.5 Evaluación del MVP Actual**

FilmVerse está bien posicionado para competir en el segmento hispanohablante y tiene un diferencial claro (chatbot IA \+ dashboard \+ foco latinoamericano). Las limitaciones principales son la ausencia de app móvil y la falta de integración con servicios de streaming.

## **7.6 Recomendación / Conclusión Final**

Se recomienda avanzar con el MVP bajo las siguientes condiciones:

* Documentar en la ERS la app móvil como requisito a futuro prioritario (no como requisito descartado).

* Definir la integración con TMDB API como decisión arquitectónica desde el diseño, aunque su implementación quede fuera del alcance del TP.

* Priorizar la calidad del chatbot como diferencial central: el prototipo debe demostrar conversaciones cinematográficas fluidas y recomendaciones pertinentes. Es el elemento que justifica la apuesta estratégica.

* Incorporar al menos 5 pantallas sociales en el prototipo: perfil público, feed de actividad, visualización de reseñas de otros usuarios, listas compartidas y seguimiento de otros cinéfilos.

**FilmVerse no es un producto más de tracking de películas. Es la primera propuesta integrada de IA conversacional \+ comunidad cinematográfica en español. Si se ejecuta bien, tiene potencial real de posicionamiento en el segmento.**