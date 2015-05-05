function check_navigator() {
        /* Variables para cada navegador, la funcion indexof() si no encuentra la cadena devuelve -1, 
        las variables se quedaran sin valor si la funcion indexof() no ha encontrado la cadena. */
        var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
        var is_chrome= navigator.userAgent.toLowerCase().indexOf('chrome/') > -1;
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox/') > -1;
        var is_ie = navigator.userAgent.toLowerCase().indexOf('msie ') > -1;
 
        /* Detectando  si es Safari, vereis que en esta condicion preguntaremos por chrome ademas, esto es porque el 
        la cadena de texto userAgent de Safari es un poco especial y muy parecida a chrome debido a que los dos navegadores
        usan webkit. */
 
        if (is_safari && !is_chrome ) {
 
            /* Buscamos la cadena 'Version' para obtener su posicion en la cadena de texto, para ello
            utilizaremos la funcion, tolowercase() e indexof() que explicamos anteriormente */
            var posicion = navigator.userAgent.toLowerCase().indexOf('Version/');
 
            /* Una vez que tenemos la posición de la cadena de texto que indica la version capturamos la
            subcadena con substring(), como son 4 caracteres los obtendremos de 9 al 12 que es donde 
            acaba la palabra 'version'. Tambien podraimos obtener la version con navigator.appVersion, pero
            la gran mayoria de las veces no es la version correcta. */
            var ver_safari = navigator.userAgent.toLowerCase().substring(posicion+9, posicion+12);
 
            // Convertimos la cadena de texto a float y mostramos la version y el navegador
            ver_safari = parseFloat(ver_safari);
 
            return 'Safari,' + ver_safari);
        }
 
        //Detectando si es Chrome
        if (is_chrome ) {
            var posicion = navigator.userAgent.toLowerCase().indexOf('chrome/');
            var ver_chrome = navigator.userAgent.toLowerCase().substring(posicion+7, posicion+11);
            //Comprobar version
            ver_chrome = parseFloat(ver_chrome);
            return 'Chrome';
        }
 
        //Detectando si es Firefox
        if (is_firefox ) {
            var posicion = navigator.userAgent.toLowerCase().lastIndexOf('firefox/');
            var ver_firefox = navigator.userAgent.toLowerCase().substring(posicion+8, posicion+12);
            //Comprobar version
            ver_firefox = parseFloat(ver_firefox); 
            return 'Firefox';
        }
 
        //Detectando Cualquier version de IE
        if (is_ie ) {
            var posicion = navigator.userAgent.toLowerCase().lastIndexOf('msie ');
            var ver_ie = navigator.userAgent.toLowerCase().substring(posicion+5, posicion+8);
            //Comprobar version
            ver_ie = parseFloat(ver_ie);
            return 'MSIE';
        }
    }