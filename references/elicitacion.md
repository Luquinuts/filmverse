  
**Universidad Atlántida Argentina**  
Facultad de Ingeniería  
Ingeniería de Software III

**FilmVerse**

**TP2 – Elicitación**  
Elicitación

Versión: 1    |    Fecha de entrega: 17/04/2026

**Integrantes del Grupo 3**  
Metrailler Iván  
Galende Ramiro  
Palavecino Lucas

Profesora: Galia Carolina Serruya

# 

**[1\. Encuestado	2](#1.-encuestado)**

[**2\. Objetivo de la Entrevista	2**](#2.-objetivo-de-la-entrevista)

[**3\. Fecha de Realización y Herramienta de IA Utilizada	3**](#3.-fecha-de-realización-y-herramienta-de-ia-utilizada)

[**4\. Estructura de la Entrevista — Justificación	4**](#4.-estructura-de-la-entrevista-—-justificación)

[**5\. Listado de Preguntas Clasificadas y Respuestas	5**](#5.-listado-de-preguntas-clasificadas-y-respuestas)

[**6\. Resumen e Informe de lo Relevado	9**](#6.-resumen-e-informe-de-lo-relevado)

[**7\. Conclusión grupal de la experiencia con la IA para la entrevista	11**](#7.-conclusión-grupal-de-la-experiencia-con-la-ia)

# 

# **1\. Encuestado** {#1.-encuestado}

**Nombre/Perfil:** Cliente representativo — perfil simulado para fines académicos

**Descripción:** Espectador frecuente de cine y series, de entre 25 y 35 años, residente en Argentina. Usuario habitual de múltiples plataformas de streaming (Netflix, Disney+, Prime Video). Consume contenido audiovisual varias veces por semana y tiene el hábito de guardar títulos "para ver después", aunque frecuentemente no los retoma. No es un cinéfilo especializado, pero sí un consumidor activo con criterio propio. Valora las recomendaciones personalizadas y se frustra con la dispersión de información entre plataformas.

**Rol respecto al producto:** Usuario final objetivo de FilmVerse. Su perspectiva representa al segmento principal de la plataforma: cinéfilos casuales-activos hispanohablantes.

 

# **2\. Objetivo de la Entrevista** {#2.-objetivo-de-la-entrevista}

La entrevista tuvo como objetivo principal relevar las necesidades, expectativas y prioridades del cliente respecto a la aplicación FilmVerse, con foco en:

 

• Comprender el problema que el cliente busca resolver con la aplicación.

• Identificar las funcionalidades que considera imprescindibles vs. deseables.

• Conocer sus preferencias respecto a la experiencia de usuario, modelo de negocio y aspectos tecnológicos.

• Obtener insumos para la definición de requerimientos funcionales y no funcionales.

• Validar la propuesta de valor de FilmVerse desde la perspectiva del usuario objetivo.

# 

# **3\. Fecha de Realización y Herramienta de IA Utilizada** {#3.-fecha-de-realización-y-herramienta-de-ia-utilizada}

**Fecha de realización:** 07 Abril de 2026

**Modalidad:** Entrevista semiestructurada simulada mediante inteligencia artificial generativa.

 

Para la realización de esta entrevista, el equipo utilizó ChatGPT (OpenIA) como herramienta de inteligencia artificial. La IA fue configurada para asumir el rol de un cliente representativo del segmento objetivo de FilmVerse, con el perfil descrito en la sección anterior.

 

El procedimiento fue el siguiente: el equipo preparó previamente las preguntas clasificadas y las formuló a la IA en formato de conversación. La herramienta generó respuestas en primera persona, simulando los razonamientos, dudas y prioridades que tendría un usuario real del segmento objetivo. Las respuestas fueron luego transcritas y analizadas para extraer requerimientos.

# 

# **4\. Estructura de la Entrevista — Justificación** {#4.-estructura-de-la-entrevista-—-justificación}

Se eligió el formato de entrevista semiestructurada por las siguientes razones:

 

• Permite guiar la conversación hacia los temas clave (objetivos, funcionalidades, IA, modelo de negocio) sin perder flexibilidad para profundizar en aspectos emergentes.

• Es adecuada para la etapa inicial de elicitación, donde el cliente aún no tiene definidas todas sus necesidades con precisión.

• Facilita la obtención de respuestas abiertas y ricas en matices, lo que aporta mayor contexto para la definición de requerimientos.

 

La entrevista se organizó en ocho (8) bloques temáticos, cada uno con preguntas específicas. Esta estructura cubre las dimensiones clave del producto: propósito, usuarios, funcionalidades, aspectos sociales, IA, alcance, tecnología y modelo de negocio. Las preguntas fueron clasificadas según su tipo para garantizar cobertura tanto de requerimientos funcionales como no funcionales.

 

Clasificación de preguntas utilizada:

 

• Abiertas (AB): invitan al cliente a expresarse libremente sin opciones predefinidas.

• Cerradas (CE): buscan confirmación o elección entre opciones.

• Funcionales (RF): orientadas a identificar comportamientos y funcionalidades del sistema.

• No funcionales (RNF): orientadas a atributos de calidad, restricciones o características del sistema.

# 

# **5\. Listado de Preguntas Clasificadas y Respuestas** {#5.-listado-de-preguntas-clasificadas-y-respuestas}

#  

### **Bloque 1 — Objetivos del Producto**

 

| P01 | ¿Cuál es el problema específico que la aplicación busca resolver?  *\[AB · RF\]* |
| :---- | :---- |

*Hoy en día tengo un montón de películas y series que quiero ver, pero termino perdiendo mucho tiempo buscando qué mirar. Uso varias plataformas y está todo medio desordenado. A veces no recuerdo si algo ya lo vi, o dónde estaba disponible. También me cuesta encontrar recomendaciones que realmente me gusten. El problema principal es ese: no tengo una forma clara y cómoda de organizar lo que quiero ver y descubrir contenido que valga la pena sin perder tanto tiempo.*

| P02 | ¿Cuál es la principal propuesta de valor de la aplicación? ¿Qué va a ofrecer que otras aplicaciones similares no ofrecen?  *\[AB · RF · RNF\]* |
| :---- | :---- |

*Lo más importante sería que me simplifique la vida. En un solo lugar poder tener todo: lo que quiero ver, lo que ya vi, y que además me recomiende cosas que realmente me interesen, no cosas al azar como pasa en otras apps. Las plataformas actuales muestran mucho contenido, pero no siempre aciertan con lo que te gusta. Si esta aplicación logra entender mejor mis gustos y ahorrarme tiempo decidiendo, ahí estaría el valor.*

 

### **Bloque 2 — Usuarios y Segmentación**

 

| P03 | Describa el perfil del usuario objetivo principal (edad, interés en cine, conocimientos, hábitos de consumo, etc.).  *\[AB · RNF\]* |
| :---- | :---- |

*Está más pensado para gente bastante enganchada con el cine o las series. No necesariamente expertos, pero sí personas que consumen bastante seguido, ponele entre 18 y 40 años, que usan varias plataformas de streaming y están acostumbrados a buscar contenido online. Suelen ver algo varias veces por semana, guardan cosas "para ver después", pero después se olvidan o no las encuentran. Son usuarios que más o menos se manejan bien con la tecnología, nada súper técnico, pero sí cómodos usando apps. Es más por el hábito de consumo que por edad.*

| P04 | ¿Se contemplan distintos tipos de usuarios o roles (usuario estándar, premium, moderador, administrador)? Describa cada rol y sus permisos.  *\[AB · RF · RNF\]* |
| :---- | :---- |

*Podría haber al menos un usuario "normal", que sería cualquiera que usa la app para organizar lo que ve y recibir recomendaciones. Después, tal vez algo tipo "premium", pero no tengo claro qué tendría de distinto, supongo que alguna ventaja o función extra. Del lado interno, debería haber alguien que administre la plataforma para manejar contenido o resolver problemas. Eso de los roles no es lo que más me preocupa ahora; me interesa más que funcione bien para el usuario común.*

 

### **Bloque 3 — Funcionalidades Principales**

 

| P05 | ¿Los usuarios podrán calificar las películas? ¿Qué sistema de puntuación se va a utilizar? *\[CE · RF\]* |
| :---- | :---- |

*Sí, eso me gustaría bastante. Es importante poder calificar lo que veo, porque también ayudaría a que después me recomiende mejor. El sistema... algo simple. Tipo estrellas o un puntaje del 1 al 5\. No algo complicado. Más que la precisión del número, me importa que sea rápido de usar, que no me dé pereza calificar después de ver algo.*

| P06 | ¿Los usuarios podrán escribir reseñas? ¿Se necesita moderación automática?  *\[CE · RF · RNF\]* |
| :---- | :---- |

*Sí, me gustaría que se puedan escribir reseñas. A veces uno quiere explayarse un poco más que solo poner una puntuación. Pero tampoco algo súper complejo, más bien opiniones cortas o medianas. Sobre la moderación, entiendo que sí debería haber algún control, para evitar contenido ofensivo o cosas fuera de lugar. No me gustaría que se llene de comentarios tóxicos o spam.*

| P07 | ¿Qué información debe mostrarse obligatoriamente para cada película?  *\[CE · RF\]* |
| :---- | :---- |

*Lo básico seguro: título, una breve descripción, género, quién actúa o quién la dirigió. Después, algo que para mí es clave: dónde se puede ver, en qué plataforma está disponible. La duración también suma, porque a veces elijo según el tiempo que tengo. Y estaría bueno ver la calificación general y algunas opiniones de otros usuarios.*

| P08 | Indique los criterios de búsqueda y filtrado que deben estar disponibles.  *\[AB · RF\]* |
| :---- | :---- |

*Me gustaría poder buscar por nombre, pero también filtrar por género, año, incluso por plataforma, para ver solo lo que está en la que uso. Después, estaría bueno algo por calificación, para ver lo mejor puntuado. Y capaz por duración también, para cuando tengo poco tiempo. Mientras más fácil sea encontrar algo sin tener que dar mil vueltas, mejor.*

 

### **Bloque 4 — Interacción Social**

 

| P09 | ¿La aplicación incluirá funcionalidades sociales (amigos/seguidores)? ¿Cuáles? ¿Cómo debe funcionar?  *\[AB · RF\]* |
| :---- | :---- |

*No lo tenía como lo principal, pero sí, le sumaría bastante algo social. Por ejemplo, poder seguir a otras personas y ver qué están mirando o qué recomiendan. A veces confío más en lo que ve alguien con gustos parecidos que en lo que sugiere la plataforma. También estaría bueno poder compartir listas. No algo tan complejo como una red social completa, pero sí al menos esa parte de conectar con otros usuarios y descubrir contenido por ahí.*

| P10 | ¿Los usuarios podrán interactuar con el contenido de otros usuarios?  *\[CE · RF\]* |
| :---- | :---- |

*Sí, estaría bueno eso. Por ejemplo, poder dar "me gusta" a una reseña o a una lista que armó otro usuario. Capaz también comentar, pero algo simple. La idea sería que haya cierta interacción, pero sin que se vuelva pesado o una red social llena de cosas. Más bien algo que sume para descubrir contenido.*

 

### **Bloque 5 — Inteligencia Artificial**

 

| P11 | ¿Se desea incorporar funcionalidades de inteligencia artificial? ¿Para qué se utilizará? *\[CE · RF · RNF\]* |
| :---- | :---- |

*Sí, puede ser, pero más como algo que ayude desde atrás, no algo tan visible. Sobre todo para las recomendaciones. Me interesa que entienda mis gustos en base a lo que veo, lo que califico, incluso lo que voy guardando. También capaz para ordenar mejor el contenido o mostrar primero lo que más me puede interesar. Mientras sirva para que no tenga que pensar tanto qué ver y me acierte más seguido, ya me sirve.*

| P12 | ¿En qué se deben basar las recomendaciones?  *\[AB · RF\]* |
| :---- | :---- |

*Principalmente en mis gustos. En lo que ya vi, lo que califiqué y lo que fui guardando para ver después. Eso dice bastante de lo que me interesa. También podría servir ver patrones, como géneros que veo más seguido o actores y directores que se repiten. Y si suma algo de lo que ve gente con gustos parecidos, mejor. Pero lo principal es que esté bien personalizado, no recomendaciones genéricas.*

 

### **Bloque 6 — Alcance del Producto**

 

| P13 | ¿La aplicación ofrecerá contenido en streaming? ¿Se integrará con otras plataformas (Netflix, Prime Video, etc.)?  *\[CE · RF · RNF\]* |
| :---- | :---- |

*No, en principio no lo veo como una plataforma para ver contenido directamente. La idea no es competir con esas apps, sino ayudarme a organizarme y decidir qué ver. Sobre integrarse, estaría bueno que al menos me diga en qué plataforma está cada película o serie. Como mínimo saber dónde verla sin tener que buscar por mi cuenta.*

 

### **Bloque 7 — Plataforma y Tecnología**

 

| P14 | ¿En qué plataformas debe estar disponible la aplicación?  *\[AB · RNF\]* |
| :---- | :---- |

*Idealmente que esté en el celular seguro, porque es donde más usaría algo así. Después, si también se puede usar desde la compu, mejor, para cuando estoy en casa viendo qué mirar. Mientras sea fácil de acceder en el día a día, ya suma bastante.*

| P15 | ¿Se requiere integración con sistemas externos? ¿Cuáles?  *\[AB · RNF\]* |
| :---- | :---- |

*Integración fuerte no sé si necesito. Pero sí, al menos que tome información de otras plataformas para saber en dónde está disponible cada película o serie. Es clave no tener que ir app por app buscando. Fuera de eso, no tengo claro si haría falta algo más.*

 

### **Bloque 8 — Modelo de Negocio**

 

| P16 | ¿Cuál será el modelo de monetización principal?  *\[AB · RNF\]* |
| :---- | :---- |

*No lo tengo tan definido, pero supongo que algo tipo freemium podría funcionar. Una versión gratis con lo básico y después alguna opción paga con cosas extra, aunque no tengo claro todavía qué cosas serían esas. Lo que sí, no me gustaría que esté lleno de publicidad molesta. Si hay anuncios, que no arruinen la experiencia.*

| P17 | En el caso de los usuarios premium, ¿qué funcionalidades extras podrían tener?  *\[AB · RF · RNF\]* |
| :---- | :---- |

*Podría ser recomendaciones más afinadas, algo más personalizado todavía. Capaz también poder ver estadísticas propias, tipo qué géneros veo más, cuánto tiempo paso viendo cosas. Otra cosa podría ser sacar cualquier publicidad, si es que hay en la versión gratis. Y quizá alguna ventaja en lo social, como destacar las reseñas. Pero eso es medio secundario para mí.*

# 

# **6\. Resumen e Informe de lo Relevado** {#6.-resumen-e-informe-de-lo-relevado}

A partir de la entrevista realizada, se identificaron los siguientes hallazgos principales:

 

### **Problema central del usuario**

El usuario enfrenta tres dificultades concretas: (1) dificultad para organizar lo que ya vio y lo que quiere ver, disperso en múltiples plataformas; (2) tiempo excesivo invertido en decidir qué mirar; (3) recomendaciones poco personalizadas en las plataformas actuales. FilmVerse debe resolver los tres problemas en una sola experiencia.

 

### **Funcionalidades imprescindibles**

• Listas de películas vistas y pendientes

• Sistema de calificación simple (estrellas o escala 1-5), rápido de usar.

• Reseñas cortas/medianas con moderación básica de contenido ofensivo.

• Ficha de película con: título, descripción, género, elenco, director, duración, plataforma disponible y calificación general.

• Búsqueda y filtrado por nombre, género, año, plataforma, calificación y duración.

• Recomendaciones personalizadas basadas en historial, calificaciones y patrones de consumo.

 

### **Funcionalidades deseables**

• Funcionalidad social: seguir usuarios, ver su actividad, compartir listas.

• Interacción con contenido de otros usuarios: "me gusta" en reseñas y listas.

• Dashboard con estadísticas personales (géneros más vistos, tiempo total, tendencias).

• Indicación de en qué plataforma está disponible cada título (integración básica de streaming).

 

### **Aspectos de negocio y tecnología**

• Modelo freemium: acceso gratuito al núcleo funcional; premium con recomendaciones avanzadas, estadísticas y sin publicidad.

• Disponibilidad multiplataforma: móvil (prioritario) y web.

• Sin reproducción de streaming: el producto es un organizador/descubridor, no un reproductor.

• Publicidad, si existe, debe ser no intrusiva.

 

### **Requerimientos implícitos detectados**

• Usabilidad: la calificación debe ser rápida, sin fricción. La búsqueda debe ser eficiente.

• Moderación de contenido: necesaria para el componente social (reseñas y comentarios).

• Personalización: es el valor central del producto; las recomendaciones genéricas son inaceptables para el usuario.

• Onboarding con historial: el usuario debe poder cargar películas ya vistas para que el sistema empiece a aprender sus gustos desde el primer uso.

# 

# **7\. Conclusión grupal de la experiencia con la IA** {#7.-conclusión-grupal-de-la-experiencia-con-la-ia}

### **Utilidad de la herramienta**

La utilización de ChatGPT (OpenIA) como herramienta para simular la entrevista con el cliente resultó altamente útil en el contexto de este proyecto académico. La IA permitió obtener respuestas coherentes con el perfil de usuario definido, reproduciendo con fidelidad el lenguaje coloquial, las dudas y las prioridades de un usuario real del segmento objetivo. Esto nos facilitó avanzar en la elicitación sin depender de la disponibilidad de un cliente externo.

 

### **Dificultades encontradas**

• La IA tiende a ser más completa y articulada que un cliente real: en ocasiones anticipa aspectos de la pregunta antes de ser formulados, lo que reduce la naturaleza exploratoria de la entrevista.

• Fue necesario calibrar el prompt inicial para que las respuestas no sonaran demasiado técnicas o estructuradas: un usuario real hablaría con más imprecisión y contradicciones.

• Algunas respuestas resultaron excesivamente equilibradas, lo que obligó al equipo a interpretar y priorizar las necesidades, trabajo que con un cliente real se haría de forma más directa.

 

### **Beneficios identificados**

• Disponibilidad inmediata: no fue necesario coordinar horarios ni esperar la disponibilidad de un entrevistado.

• Reproducibilidad: las respuestas pueden regenerarse con variaciones controladas para explorar distintos escenarios de usuario.

• Profundidad: la IA puede profundizar en cualquier aspecto consultado con alta coherencia interna.

• Velocidad: el ciclo completo de entrevista, transcripción y análisis se realizó en una sola sesión de trabajo.

 

### **Opinión grupal**

El equipo considera que la IA es una herramienta válida y poderosa para la etapa de elicitación en contextos donde no se dispone de usuarios reales. Sin embargo, no reemplaza completamente la riqueza de una entrevista real: la IA no puede sorprendernos con necesidades que no hayamos contemplado en el prompt, y no tiene la ambigüedad productiva que a veces genera el hallazgo de requerimientos ocultos.

 

Como conclusión, recomendamos utilizar la IA como complemento a las técnicas tradicionales de elicitación: es especialmente útil para iterar sobre preguntas, validar hipótesis y generar volumen de datos cuando no se tienen entrevistados disponibles. Para proyectos reales, debería combinarse con al menos una sesión con usuarios reales.

