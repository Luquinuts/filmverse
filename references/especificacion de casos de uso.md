**Universidad Atlántida Argentina**  
Facultad de Ingeniería  
Ingeniería de Software III

**FilmVerse**

**TP4 – Especificación de CU**  
Modelo de Casos de Uso

Versión: 1    |    Fecha de entrega: 19/04/2026

**Integrantes del Grupo 3**  
Metrailler Iván  
Galende Ramiro  
Palavecino Lucas

Profesora: Galia Carolina Serruya

[Casos de Uso \- TP Grupal ISW3 \- Hojas de cálculo de Google](https://docs.google.com/spreadsheets/d/1un3XsgmMuUrJBtE8bYmCatzq3SqENBMaatF7xHh1IZU/edit?gid=0#gid=0)

| CU 02 \- Iniciar Sesión |  |
| ----- | :---- |
| Nombre | Iniciar Sesión |
| Descripción | Iniciar Sesión en el sistema |
| Objetivo | El usuario inicia sesión en el sistema, pudiendo acceder a su contenido personal y a escribir reseñas |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Media \- Baja |
| Prioridad | Alta |
| Analista | Ramiro Galende |
| Actor/es | Usuario |
| Precondiciones | CU 05 \- Registrarse en la plataforma |
| Flujo Normal | 1\. El usuario selecciona iniciar sesión en **UIPrincipal**. |
|  | 2\. El sistema muestra la ventana **UILogIn**. |
|  | 3\. \[A1\]El usuario ingresa usuario y contraseña en **UILogIn**. |
|  | 4\. El sistema consulta que el usuario exista en Usuarios\[A2\], y verifica que la contraseña coincida con la almacenada en Usuarios\[A3\]. El sistema redirige a **UISesionIniciada**. |
| Postcondiciones | El usuario queda logueado en el sistema |
| Flujo alternativo \[A1\] | 3\. El usuario selecciona Recuperar Contraseña \<\<Extiende CU04\>\> |
| Flujo alternativo \[A2\] | 4\. El sistema verifica que el usuario no existe en Usuarios. El sistema muestra "Usuario o contraseña no válido" en **UIError**. |
| Flujo alternativo \[A3\] | 4\. El sistema consulta que el usuario exista en Usuarios, y verifica que la contraseña no coincide con la almacenada en Usuarios. El sistema muestra "Usuario o contraseña no válido" en **UIError**. |
| RFs | \--- |
| RNFs | \--- |

| CU 15 \- Ver dashboard personal |  |
| ----- | :---- |
| Nombre | Ver dashboard personal |
| Descripción | El usuario puede ver su dashboard personal |
| Objetivo | Permitir al usuario visualizar películas recomendadas y listas personalizadas |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Media |
| Analista | Iván Metrailler |
| Actor/es | Cinéfilo |
| Precondiciones | Que el Cinéfilo se encuentre logueado en la plataforma |
| Flujo Normal | 1\. El Cinéfilo selecciona el apartado de dashboard personal en **IUInicio** |
|  | 2\. El sistema obtiene los datos correspondientes a la id del Cinéfilo de PeliculasVistas, PeliculasPendientes, MeGustas, Seguidos, Reseñas, Listas. Muestra el **IUDashboard** con la lista de películas pendientes, de películas vistas, de me gustas, de Cinéfilos seguidos, de reseñas y de listas creadas con los resultados obtenidos.\[A2\] \[A2.1\] \[A2.2\] \[A2.3\] \[A2.4\] \[A2.5\] \[A2.6\] \[A2.7\] |
| Postcondiciones |  |
| Flujo alternativo 1 | \[A2\] El sistema no encuentra información con esa id de Cinéfilo |
|  | 2\. El sistema verifica la id del Cinéfilo en Cinéfilos, no obtiene ningún dato. Muestra el **IUDashboard** sin datos. |
| Flujo alternativo 2 | \[A2.1\] El Cinéfilo accede al panel de Películas Vistas |
|  | 3\. El Cinéfilo clickea en las películas vistas |
|  | 4\. El sistema muestra el **IUPeliculasVistas** |
| Flujo alternativo 3 | \[A2.2\] El Cinéfilo accede al panel de Peliculas Pendientes |
|  | 3\. El Cinéfilo clickea en las películas pendientes |
|  | 4\. El sistema muestra el **IUPeliculasPendientes** |
| Flujo alternativo 4 | \[A2.3\] El Cinéfilo accede al panel de Me Gustas |
|  | 3\. El Cinéfilo clickea en sus me gustas |
|  | 4\. El sistema muestra el **IUMisMeGusta** |
| Flujo alternativo 5 | \[A2.4\] El Cinéfilo accede al panel de Me Gustas |
|  | 3\. El Cinéfilo clickea en sus me gustas |
|  | 4\. El sistema muestra el **IUMisMeGusta** |
| Flujo alternativo 6 | \[A2.5\] El Cinéfilo accede al panel de Usuarios Seguidos |
|  | 3\. El Cinéfilo clickea en sus usuarios seguidos |
|  | 4\. El sistema muestra el **IUMisUsuariosSeguidos** |
| Flujo alternativo 7 | \[A2.6\] El Cinéfilo accede al panel de sus Reseñas Realizadas |
|  | 3\. El Cinéfilo clickea en sus reseñas realizadas |
|  | 4\. El sistema muestra el **IUMisReseñas** |
| Flujo alternativo 8 | \[A2.7\] El Cinéfilo accede al panel de sus Listas Creadas |
|  | 3\. El Cinéfilo clickea en sus listas creadas |
|  | 4\. El sistema muestra el **IUListasCreadas** |
| RFs | \--- |
| RNFs | \--- |

| CU 16 \- Suscribirse a versión premium |  |
| ----- | :---- |
| Nombre | Suscribirse a versión premium |
| Descripción | El usuario se subscribe a la versión premium para tener acceso a funcionalidades con IA |
| Objetivo | Que el usuario se suscriba a la versión premium |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Alta |
| Analista | Iván Metrailler |
| Actor/es | Cinéfilo y Plataforma de Pago |
| Precondiciones | Que el usuario se encuentre registrado y logueado en el sistema |
| Flujo Normal | 1\. El usuario accede a la sección de subscribirse a versión premium en **IUInicio** |
|  | 2\. El sistema muestra el **IUSubscripciónPremium** con el plan de pago disponible. |
|  | 3\. El usuario selecciona pagar |
|  | 4\. El sistema redirige a mercado pago |
|  | 5\. El usuario vuelve de mercado pago |
|  | 6\. El sistema solicita confirmación a mercado pago |
|  | 7\. Mercado pago devuelve la confirmación de pago |
|  | 8\. El sistema verifica que se efectúe el pago \[A8\] guardando los datos de pago en Pagos, guarda la id del usuario en UsuariosPremium. Finalmente muestra el IUPagoConfirmado |
|  | 9\. El usuario acepta |
|  | 10\. El sistema vuelve al IUInicio |
| Postcondiciones | Pago cargado en Pagos, e id usuario cargada en UsuariosPremium |
| Flujo alternativo 1 | \[A8\] El pago no pudo efectuarse |
|  | 8\. El sistema redirige a IUSubscripciónPremium, mostrando que el pago no se ha efectuado, solicitando que lo intente nuevamente |
| RFs | \--- |
| RNFs | \--- |

| CU 23 \- Consultar al chatbot de recomendaciones |  |
| ----- | :---- |
| Nombre | Consultar al chatbot de recomendaciones |
| Descripción | El usuario interactúa con un chatbot con IA para recibir recomendaciones personalizadas en base a sus preferencias, historial de actividad, seguidos, y el prompt ingresado. Puede agregar las películas a "Ver más tarde". |
| Objetivo | Permite al usuario consultar al chatbot sobre recomendaciones para ver basado en un prompt e historial del usuario. |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Media |
| Analista | Ramiro Galende |
| Actor/es | Usuario, Proveedor de IA |
| Precondiciones | CU 02 \- Iniciar Sesión |
| Flujo Normal | 1\. El usuario clickea sobre el Chatbot en **UIPrincipal** |
|  | 2\. El sistema busca en PeliculasVistas, PeliculasPendientes, MeGustas, Seguidos, Reseñas, Listas. Inicia una sesión con el servicio de la IA \[A3\], y envía la información del usuario. Luego, muestra **UIChatbot**. |
|  | 3\. El usuario ingresa un prompt en **UIChatbot**. |
|  | 4\. El sistema envía el prompt al servicio de la IA. |
|  | 5\. El servicio de IA retorna una respuesta. |
|  | 6\. El sistema agrega la respuesta obtenida en **UIChatbot.** |
|  | 7\. El sistema consulta al usuario si desea agregar una película a "Ver más tarde". |
|  | 8\. \[A8\] El usuario selecciona agregar la película a "Ver más tarde". |
|  | 9\. El sistema almacena la película en "Ver más tarde". |
|  | 10\. Vuelve a \[3\] |
| Postcondiciones | Las películas seleccionadas quedan almacenadas en "Ver más tarde". |
| Flujo alternativo \[A3\] Servicio de IA no está disponible | 2\. El servicio de IA no está disponible. El sistema muestra **UIErrorChatbot.** |
| Flujo alternativo \[A7\] Usuario cierra el chatbot | 3\. El usuario selecciona **Cerrar**. |
|  | 4\. El sistema muestra **UIPrincipal**. |
| Flujo alternativo \[A8\] Usuario no agrega película | 7\. El usuario selecciona no agregar película. |
|  | 8\. Vuelve a \[3\] |
| RFs | \--- |
| RNFs | \--- |

| CU 32 \- Generar reporte de películas recomendadas para ver durante el día |  |
| ----- | :---- |
| Nombre | Generar reporte de películas recomendadas para ver durante el día |
| Descripción | Generar un reporte por parte del sistema para recomendaciones de ver al usuario |
| Objetivo | Tener un reporte personalizado todos los días para los usuarios premium sobre recomendaciones de películas |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Alta |
| Analista | Lucas Palavecino |
| Actor/es | Proveedor de IA |
| Precondiciones | Horario del servidor donde se encuentre alojado el sistema tiene que ser 21:00 Hrs UTC-3 |
| Flujo Normal | 1\. El Sistema obtiene de Usuarios todos los tipos de usuarios premium, obtiene los datos de Peliculas, PeliculasVistas, Usuarios, PeliculasPendientes, PeliculasReseñadas, por cada usuario y solicita al Proveedor de IA nuevas recomendaciones de películas 2\. El Proveedor de IA devuelve un reporte especifico de proximas peliculas por ver para cada usuario solicitado generado en base a las películas vistas de cada usuario y la nota de reseña dada para cada una 3\. El Sistema guarda toda la información del reporte por cada usuario en PeliculaRecomendaciones |
| Postcondiciones | Reporte generado |
| Flujo alternativo 1 | \--- |
| RFs | \--- |
| RNFs | \--- |

| CU 35 \- Banear usuario |  |
| ----- | :---- |
| Nombre | Banear usuario |
| Descripción | Banear a un usuario del sistema |
| Objetivo | Permitir al administrador del sistema banear un usuario para que no pueda seguir escribiendo reseñas |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Baja |
| Prioridad | Media |
| Analista | Lucas Palavecino |
| Actor/es | Administrador |
| Precondiciones | Tener un usuario creado en el sistema. Haber iniciado sesión con cuenta de tipo administrador |
| Flujo Normal | 1\. El Sistema muestra **IUDashboard** 2\. El Administrador presiona el icono de sidebar 3\. El Sistema muestra **IUSidebar** 4\. El Administrador selecciona la opción de usuarios 5\. El Sistema muestra **IUGestión de usuarios** 6\. El Administrador busca un usuario por su nombre 7\. El Sistema verifica el usuario en Usuarios, verifica que existen coincidencias por el nombre y devuelve todos los resultados correspondientes \[F7\] 8\. El Administrador verifica la lista de usuarios y selecciona uno 9\. El Sistema verifica el usuario seleccionado y busca en UsuariosReportados, verifica que el usuario tiene 3 o más reportes y muestra **IUAccion con usuario** con el botón de Ban habilitado \[F9\] 10\. El Administrador presiona el botón de Ban 11\. El Sistema modifica el estado del usuario en Usuarios y muestra **IUCambios correctos** |
| Postcondiciones | Usuario restringido en funcionalidad |
| Flujo alternativo 1 | \[F7\] El Sistema verifica el usuario en Usuarios, verifica que no existen coincidencias por el nombre y devuelve **IUSin coincidencias** El administrador vuelve al caso 6 \[F9\] El Sistema verifica el usuario seleccionado y busca en UsuariosReportados, verifica que el usuario tiene menos de 3 reportes y muestra **IUAccion con usuario** con el botón de Ban deshabilitado |
| RFs | \--- |
| RNFs | \--- |

| CU 29 \- Consultar información de una película al chatbot |  |
| ----- | :---- |
| Nombre | Consultar información de una película al chatbot |
| Descripción | El Usuario Premium interactúa con el chatbot de IA para consultar información más detallada y completa sobre una película en particular |
| Objetivo | Permite al usuario consultar al chatbot sobre más información de una película. |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Alta |
| Analista | Iván Metrailler |
| Actor/es | Usuario Premium, Proveedor de IA |
| Precondiciones | CU 02 \- Iniciar Sesión CU 16 \- Suscribirse a versión premium |
| Flujo Normal | 1\. El usuario clickea sobre el Chatbot en **UIPrincipal** |
|  | 2\. El sistema busca películas. Inicia una sesión con el servicio de la IA \[A3\], y envía la información del usuario. Luego, muestra **UIChatbot**. |
|  | 3\. El usuario realiza la consulta en **UIChatbot**. |
|  | 4\. El sistema envía la consulta al servicio de la IA. |
|  | 5\. El servicio de IA retorna una respuesta. |
|  | 6\. El sistema agrega la respuesta obtenida en **UIChatbot.** |
|  | 7\. El sistema consulta al usuario si desea continuar la conversación. |
|  | 8\. \[A8\] El usuario selecciona finalizar conversación. |
|  | 9\. El sistema cierra el **UIChatbot** y vuelve al **UIPrincipal** |
| Postcondiciones |  |
| Flujo alternativo \[A3\] Servicio de IA no está disponible | 2\. El servicio de IA no está disponible. El sistema muestra **UIErrorChatbot.** |
| Flujo alternativo \[A8\] Usuario continúa con la conversación | 8\. Usuario selecciona continuar conversación |
|  | 9\. El sistema solicita al usuario realizar una nueva consulta |
|  | 10\. Vuelve a \[3\] |
| RFs | \--- |
| RNFs | \--- |

| CU 29 \- Consultar información de una película al chatbot |  |
| ----- | :---- |
| Nombre | Consultar información de una película al chatbot |
| Descripción | El Usuario Premium interactúa con el chatbot de IA para consultar información más detallada y completa sobre una película en particular |
| Objetivo | Permite al usuario consultar al chatbot sobre más información de una película. |
| Nivel de abstracción | Trazo fino |
| Versión | 1 |
| Dificultad | Alta |
| Prioridad | Alta |
| Analista | Iván Metrailler |
| Actor/es | Usuario Premium, Proveedor de IA |
| Precondiciones | CU 02 \- Iniciar Sesión CU 16 \- Suscribirse a versión premium |
| Flujo Normal | 1\. El usuario clickea sobre el Chatbot en **UIPrincipal** |
|  | 2\. El sistema busca en Peliculas. Inicia una sesión con el servicio de la IA \[A3\], y envía la información del usuario. Luego, muestra **UIChatbot**. |
|  | 3\. El usuario realiza la consulta en **UIChatbot**. |
|  | 4\. El sistema envía la consulta al servicio de la IA. |
|  | 5\. El servicio de IA retorna una respuesta. |
|  | 6\. El sistema agrega la respuesta obtenida en **UIChatbot.** |
|  | 7\. El sistema consulta al usuario si desea continuar la conversación. |
|  | 8\. \[A8\] El usuario selecciona finalizar conversación. |
|  | 9\. El sistema cierra el **UIChatbot** y vuelve al **UIPrincipal** |
| Postcondiciones |  |
| Flujo alternativo \[A3\] Servicio de IA no está disponible | 2\. El servicio de IA no está disponible. El sistema muestra **UIErrorChatbot.** |
| Flujo alternativo \[A8\] Usuario continúa con la conversación | 8\. Usuario selecciona continuar conversación |
|  | 9\. El sistema solicita al usuario realizar una nueva consulta |
|  | 10\. Vuelve a \[3\] |
| RFs | \--- |
| RNFs | \--- |

| CU 17 \- Ver ficha de película |  |
| ----- | :---- |
| Nombre | Ver ficha de película |
| Descripción | Visualizar los datos de la ficha de una película en particular |
| Objetivo | Permitir visualizar los datos de una ficha de una película seleccionada |
| Nivel de abstracción | Trazo Fino |
| Versión | 1 |
| Dificultad | Baja |
| Prioridad | Baja |
| Analista | Iván Metrailler |
| Actor/es | Cinéfilo |
| Precondiciones | CU 02 Iniciar Sesión |
| Flujo Normal | 1\. El usuario clickea sobre Ver Ficha en una película en particular 2\. El Sistema obtiene los datos de Título, Año, Género, Duración, Idioma, País, Dirección, Producción, Guión, Reparto, Productora, de Peliculas de la película seleccionada y los muestra en **IUVerFicha.** |
| Postcondiciones | Vista de Ficha de Pelicula Visualizada |
| Flujo alternativo 1 | \--- |
| RFs | \--- |
| RNFs | \--- |

| CU 19 \- Calificar y reseñar una película |  |
| ----- | :---- |
| Nombre | Calificar y reseñar una película |
| Descripción | Calificar con el sistema de puntuación de estrellas una película en particular y cargar una reseña |
| Objetivo | Permitir calificar de 1 a 5 estrellas y cargar una reseña a una película |
| Nivel de abstracción | Trazo Fino |
| Versión | 1 |
| Dificultad | Media |
| Prioridad | Media |
| Analista | Iván Metrailler |
| Actor/es | Cinéfilo |
| Precondiciones | Usuario logueado en el sistema |
| Flujo Normal | 1\. El usuario clickea sobre Reseñar Película en una película en particular 2\. El Sistema obtiene los datos de la película seleccionada en Películas y muestra el **IUReseña** 3\. El usuario califica seleccionando la cantidad de estrellas, escribe la reseña y presiona en enviar. \[A3\] \[A3.1\] 4\. El Sistema guarda los datos ingresados en Reseña y Calificación, muestra un cartel que indica "Reseña Realizada" y redirige a **IUPrincipal** |
| Postcondiciones | Nueva Reseña y calificación cargadas en el sistema |
| Flujo alternativo 1 | \[A3\] El usuario excedió el límite de 200 caracteres permitido |
|  | 4\. El sistema muestra un cartel que indica "Se excedió el límite de 200 caracteres" y redirige a **IUReseña** |
| Flujo alternativo 2 | \[A3.1\] El usuario excedió el limite de reseñas permitidas del usuario no premium |
|  | 4\. El sistema muestra un cartel que indica "Se excedió el límite de reseñas permitidas" y redirige a **IUPrincipal** |
| RFs | \--- |
| RNFs | \--- |

