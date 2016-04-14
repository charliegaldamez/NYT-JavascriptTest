function appendNoticia(noticia){
    
    jQuery(".noticias").append(
        '<div data-id="' + noticia.index + '" class="noticias_individuales">' +
            '<div class="noticias_imagen">' +
                noticia.image +
            '</div>' +
            '<div class="noticias_texto">' +
                '<p>' + noticia.title + '</p>' +
                '<a href="' + noticia.url + '" >' + noticia.about + '</a>' +
            '</div>' +
        '</div>');
    
}

jQuery(document).ready(function ($) {
    
    var busqueda = [];
    
    jQuery.ajax({
        url: 'http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=42bc86951325cf0f4ab48f5e4cbeeac6:14:74976039',
        type: 'GET',
        dataType: 'json',
        async: false,
        beforeSend: function() {
            jQuery(".noticias").append("<p>Cargando</p>");
        },
        success: function ( response ) {
            jQuery(".noticias").html("");
            jQuery.each(response.response.docs, function (i, data){
                var image = "";
                if (data.multimedia[0] != null) {
                    image = '<img src="http://nytimes.com/' + data.multimedia[0].url + '" />';
                } else {
                    image = '<p>No hay imagen</p>';
                }
                
                busqueda.push({
                        'index': i,
                        'title': data.headline.main,
                        'about': data.snippet,
                        'image': image,
                        'url': data.web_url
                });
                
                appendNoticia({
                        'index': i,
                        'title': data.headline.main,
                        'about': data.snippet,
                        'image': image,
                        'url': data.web_url
                });
            });
        }
    });

    jQuery(".buscador .buscar").click(function (event) {
        jQuery(".noticias").html("");
        var buscar_texto = jQuery(".buscador input[type=text]").val();
        var result = [];
        for(var i = 0; i < busqueda.length; i++) {
            
            if (busqueda[i].title.toLowerCase().search(buscar_texto.toLowerCase()) != -1 || busqueda[i].about.toLowerCase().search(buscar_texto.toLowerCase()) != -1) {
                
                result.push(busqueda[i].index);
                
            }
        }
                
        if (result.length === 0) {
            jQuery(".noticias").append(
                '<p>No hay resultados</p>' + 
                '<input type="button" class="refresh" value="Volver a buscar"/>'
            );
        } else {
            for(var i = 0; i < result.length; i++) {
                appendNoticia(busqueda[result[i]]);
            }   
        }
        
    });

    jQuery(".noticias").on('click', '.refresh', function () {
        jQuery(".buscador input[type=text]").val("");
        jQuery(".buscar").click();
    });
});