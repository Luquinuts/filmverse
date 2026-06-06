**Universidad Atlántida Argentina**  
Facultad de Ingeniería  
Ingeniería de Software III

**FilmVerse**

**TP5 – Especificación de Requerimientos**  
Requerimientos

Versión: 1    |    Fecha de entrega: ???/04/2026

**Integrantes del Grupo 3**  
Metrailler Iván  
Galende Ramiro  
Palavecino Lucas

Profesora: Galia Carolina Serruya

# **1\. Introducción**

## 1.1 Propósito

El presente documento constituye la Especificación de Requerimientos de Software (ERS) del sistema FilmVerse.  
Su propósito es describir, de forma completa, consistente y sin ambigüedades, el comportamiento esperado del sistema: qué debe hacer, para quién y en qué condiciones. Este documento sirve como contrato de referencia entre el equipo de desarrollo, los stakeholders y cualquier parte interesada en el producto.  
El documento está dirigido a los siguientes lectores:

* Equipo de desarrollo (analistas, diseñadores, desarrolladores de prototipo).  
* Stakeholders del producto: usuarios finales, administradores, el cliente, los proveedores, testers, competidores y usuarios potenciales.

## 1.2 Alcance

FilmVerse es una plataforma web orientada a cinéfilos y espectadores, principalmente de habla hispana. Su objetivo central es integrar en un único entorno tres pilares que hoy se encuentran dispersos en herramientas separadas:

* La gestión personal del consumo audiovisual (listas de películas vistas y pendientes).  
* La inteligencia artificial como motor de descubrimiento (recomendaciones personalizadas y chatbot conversacional).  
* La interacción y dimensión social del cine (calificaciones, reseñas y comunidad de usuarios).

El sistema busca resolver el problema de fragmentación que enfrentan los cinéfilos al tener que combinar múltiples herramientas (Letterboxd para registro, JustWatch para disponibilidad, buscadores externos para recomendaciones) en una única experiencia integrada, potenciada por IA conversacional en español.

El sistema NO incluye:

* Emisión o reproducción de contenido en streaming.  
* Versión móvil nativa (iOS/Android) en este alcance; queda documentada como requisito a futuro.  
* Integración en tiempo real con plataformas de streaming externas (Netflix, Prime Video, etc.) en el MVP.

## 

## 1.3 Definiciones, siglas y abreviaciones

| Término | Definición |
| :---- | :---- |
| ERS / SRS | Especificación de Requerimientos de Software (Software Requirements Specification). Documento formal que describe el comportamiento externo esperado del sistema. |
| IEEE 830 | Estándar del Instituto de Ingenieros Eléctricos y Electrónicos para la escritura de especificaciones de requerimientos de software. |
| RF | Requerimiento Funcional: describe una funcionalidad o comportamiento que el sistema debe proveer. |
| RNF | Requerimiento No Funcional: describe atributo de calidad, restricción o condición de operación del sistema. |
| CU | Caso de Uso: descripción de la interacción entre un actor y el sistema para lograr un objetivo. |
| IA | Inteligencia Artificial. En FilmVerse, se refiere al motor de recomendaciones y chatbot conversacional. |
| LLM | Large Language Model. Modelo de lenguaje de gran escala utilizado como motor del chatbot de FilmVerse. |
| MVP | Minimum Viable Product. Versión mínima viable del producto con las funcionalidades esenciales. |
| Dashboard | Panel de visualización con estadísticas e indicadores personales del usuario. |
| Watchlist | Lista de películas o series pendientes de ver, gestionada por el usuario. |
| Cinéfilo | Nombre interno para el usuario estándar registrado en FilmVerse. |
| Premium | Nivel de suscripción de pago que habilita funcionalidades avanzadas. |
| TMDB | The Movie Database. API externa de referencia para metadatos de películas. |
| Feed social | Sección de actividad reciente de usuarios seguidos (reseñas, calificaciones, listas). |
| Freemium | Modelo de negocio con capa gratuita funcional y capa de pago con características adicionales. |
| UI\[Nombre\] | Interfaz de usuario identificada por nombre en los flujos de casos de uso (ej.: UILogIn, IUDashboard). |
| Moderador | Actor del sistema con permisos para revisar y eliminar reseñas reportadas. |
| Administrador | Actor con acceso completo a la gestión del sistema, usuarios y contenido. |
| TBD | To Be Defined. Indica que el dato o definición queda pendiente de confirmación. |
| API | Application Programming Interface. Interfaz por la que se comunica el programa con otros sistemas. |

## 1.4 Referencias

* IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications. Institute of Electrical and Electronics Engineers, 1998\.  
* FilmVerse – TP1: Definición del Proyecto y MVP. Grupo 3, ISW III, Universidad Atlántida Argentina. Versión 1, Abril 2026\.  
* FilmVerse – TP2: Elicitación de Requerimientos (Entrevista Simulada). Grupo 3, ISW III. Versión 1, Abril 2026\.  
* FilmVerse – TP3: Benchmarking Competitivo. Grupo 3, ISW III. Versión 1, Abril 2026\.  
* FilmVerse – Mapa de Stakeholders. Grupo 3, ISW III. Versión 1, Abril 2026\.  
* FilmVerse – Modelo de Casos de Uso. Grupo 3, ISW III. Versión 1, Abril/Mayo 2026\.

## 1.5 Apreciación Global

El presente documento está organizado en tres secciones principales:

* Sección 1 (Introducción): propósito, alcance, glosario, referencias y descripción del documento.  
* Sección 2 (Descripción Global): contexto del sistema, funciones de alto nivel, tipos de usuarios, restricciones y suposiciones.  
* Sección 3 (Requerimientos Específicos): requerimientos funcionales (RF), requerimientos no funcionales (RNF) y requerimientos de interfaz.

El documento describe el comportamiento esperado del prototipo web de FilmVerse en su versión MVP. Los requerimientos están enumerados, clasificados y descritos de forma verificable. Los elementos aún pendientes de definición se identifican con la marca \[TBD\].

# **2\. Descripción Global**

## 2.1 Perspectiva del producto

a) las interfaces del Sistema  
b) las interfaces del Usuario  
c) las interfaces del Hardware;  
d) las interfaces del Software;  
e) las interfaces de Comunicaciones;  
f) la Memoria;  
g) los Funcionamientos;  
h) los requisitos de adaptación del Site

## 2.2 Funciones del producto

A nivel de alto nivel, FilmVerse provee las siguientes funciones principales agrupadas en tres pilares:

**Pilar 1: Gestión Personal del Consumo Audiovisual**

* Registro y gestión de cuenta de usuario (alta, modificación, baja lógica, recuperación de contraseña).

* Registro manual de películas y series vistas, con fecha y calificación opcional.

* Gestión de watchlists (lista de pendientes por ver) con organización en listas personalizadas.

* Búsqueda y filtrado de títulos por nombre, género, año, plataforma disponible, calificación y duración.

* Visualización del perfil personal con historial completo y estadísticas.

**Pilar 2: Inteligencia Artificial y Descubrimiento**

* Chatbot cinematográfico conversacional: consultas en lenguaje natural para descubrir películas.

* Recomendaciones personalizadas basadas en historial de visualización, calificaciones y preferencias.

* Generación automática de reportes diarios de películas recomendadas por usuario (proceso de sistema).

* Dashboard personal con estadísticas de consumo: géneros más vistos, horas totales, calificación promedio, películas por año.

**Pilar 3: Interacciones Sociales y Comunidad**

* Calificación de películas mediante sistema de estrellas (1 a 5).

* Escritura, publicación y moderación de reseñas de usuarios.

* Sistema de seguimiento entre usuarios (follow/unfollow).

* Feed social con actividad reciente de usuarios seguidos.

* Listas creadas y compartidas, con posibilidad de dar 'me gusta' a reseñas y listas de otros.

* Suscripción a plan premium con funcionalidades avanzadas.

**Administración y Moderación**

* Gestión de usuarios por parte del administrador (búsqueda, visualización, baneo).

* Moderación de reseñas reportadas por usuarios.

* Gestión del catálogo de películas y contenido de la plataforma.

## 

## 2.3 Caracteristicas del usuario

FilmVerse contempla los siguientes tipos de usuario:

| Tipo de Usuario | Perfil | Nivel Técnico | Necesidades Principales |
| :---- | :---- | :---- | :---- |
| Cinéfilo (Usuario Estándar) | Adulto de 18-40 años. Consume contenido audiovisual con frecuencia semanal. Usa múltiples plataformas de streaming. | Básico-Intermedio. Cómodo con aplicaciones web y móviles. | Organizar listas, pedir recomendaciones, compartir opiniones, descubrir contenido. |
| Usuario Premium | Cinéfilo activo dispuesto a pagar por funcionalidades avanzadas. Perfil idéntico al estándar. | Básico-Intermedio. | Recomendaciones más precisas, estadísticas detalladas, experiencia sin publicidad. |
| Moderador | Miembro interno o de confianza con responsabilidad sobre la calidad del contenido de la plataforma. | Intermedio. Familiarizado con herramientas de gestión. | Revisar reseñas reportadas, eliminar contenido inapropiado, mantener la comunidad. |
| Administrador | Personal técnico o de gestión con acceso completo al sistema. | Avanzado. Conocimiento del sistema y sus datos. | Gestión de usuarios, contenido, estadísticas globales y resolución de incidentes. |

## 2.4 Restricciones

a) las políticas reguladoras;  
	Protección de datos personales (GDPR)  
b) las limitaciones del Hardware;  
	Navegadores modernos  
	Servidor en la nube  
c) las Interfaces a otras aplicaciones;  
	Proveedor de IA  
d) el funcionamiento Paralelo;  
	100000 usuarios simultáneos  
e) las funciones de la Auditoría;  
	Cambios deben quedar auditados a nivel de base de datos.  
f) las funciones de Control;  
	Debe permitir trazabilidad de cambios.  
g) los requisitos de lenguaje;  
	Debe estar escrito en PHP, MySQL, Apache  
h) los protocolos Señalados (por ejemplo, XON-XOFF, ACK-NACK);  
	HTTP, WebSocket  
i) los requisitos de Fiabilidad;  
	Disponibilidad 99% del tiempo. Mantenimiento días no hábiles de 22 a 01 horario Argentina.  
j) Credibilidad de la aplicación;  
k) la Seguridad y consideraciones de seguridad  
	Autenticación con OAuth.   
Datos personales deben almacenarse encriptados.

## 2.5 Atención y dependencias

Suposiciones:

* Se asume que el usuario dispone de una conexión a Internet funcional para acceder a la plataforma.  
* Se asume que el proveedor de IA externo tiene una API estable y disponible con tiempo de respuesta razonable.  
* Se asume que la API de metadatos de películas (TMDB) proveerá datos suficientes para el catálogo inicial del MVP.  
* Se asume que los usuarios del sistema tienen acceso a un dispositivo con navegador web moderno.  
* Se asume que el idioma principal de la plataforma es el español (castellano).

Dependencias:

* La funcionalidad del chatbot de recomendaciones depende directamente de la disponibilidad del proveedor de IA externo.  
* La completitud del catálogo de películas depende de la cobertura y actualización de la API de metadatos.  
* El procesamiento de pagos de suscripción premium depende de la disponibilidad y funcionamiento de Mercado Pago (o pasarela equivalente).  
* La versión móvil del sistema, aunque documentada como requisito a futuro, no introduce dependencias en el MVP actual.

# **3\. Requerimientos**

