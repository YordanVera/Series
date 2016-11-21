#**1.0.0_RC.0**

**features**
- **server:** se crean rutas para control de estado de un episodio (descargado y/o visto) [#17] (https://bitbucket.org/yordan_vera_castillo/series/issues/17/nueva-caracter-stica-rutas-para-el-control)
- **cliente:** el usuario puede guardar el estado de un episodio, en caso de que ya haya sido descargado y/o visto [#13] (https://bitbucket.org/yordan_vera_castillo/series/issues/13/nueva-caracter-stica-marcar-episodios-como)

**bug fixed**
- **detalle de de un episodio**: se aplica un workarround para solucionar el problema [#16] (https://bitbucket.org/yordan_vera_castillo/series/issues/16/bug-modal-falla-al-abrir)
- **cliente:** Se corrige error cuando imagenes no existen en la información y se mostraban como rotas, se agrega una por defecto. [#15] (https://bitbucket.org/yordan_vera_castillo/series/issues/15/bug-no-se-cargan-correctamente-las)

#**0.0.3.fly.2**
- se agrega el detalle de cada capítulo dentro de un modal, en el se encuentran los links y los subtítulos relacionados con su versión.

#**0.0.3.fly.1**

- se agrega el detalle por cada serie.
- dentro del detalle de cada serie se puede acceder al listado de capítulos por temporada.

#**0.0.2.fly.0**

- se despliega la lista de series, obteniendo su data a través de la API de TMDB
- se establecen las rutas básicas del lado del servidor para la conexión con la bd y con tmdb.
- se habilita la opción para agregar nuevas series.

#**0.0.1-initial.1**

- se separan los archivos build de los source, dando lugar a una nueva estructuración del código fuente principal.

#**0.0.1-initial.0**

- proyecto inicial (vacío)