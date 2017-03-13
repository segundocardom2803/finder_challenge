var app=angular.module("finder",[]);app.controller("appController",["$scope","urlService","proceso",function(scope,urlService,proceso){function mostrarCategorias(data){scope.categorias=data.entities.categories[0]}function mostrarIdiomas(data){scope.idiomas=data.entities.lang[0]}function mostrarPresentaciones(data){scope.presentaciones=data.entities.edition[0]}function mostrarGuardados(data){scope.guardados=data.entities.saved}function cargarData(data){scope.dataGlobal=data.data,scope.data=data.data,scope.paginacion(scope.data.length),scope.mostrarPagina(1)}function refrescarPagina(arr){scope.data=arr,scope.paginacion(scope.data.length),scope.mostrarPagina(1)}scope.itemCategoria=$("html section#app #aside .item_aside.categorias ul li.child a"),scope.categorias=[],scope.idiomas=[],scope.presentaciones=[],scope.guardados=[],scope.dataGlobal=[],scope.data=[],scope.dataPagina=[],scope.paginas=[],scope.itemsxpagina=9,$("section#app #aside .item_aside ul li.todos").on("click",function(){window.history.pushState("","","/finder/")}),scope.cargar=function(func){var url=urlService.getUrl();localStorage.getItem("existe");proceso.procesar(url,"",func)},scope.paginacion=function(cantidad){var paginas=parseInt(cantidad/scope.itemsxpagina);cantidad%scope.itemsxpagina>0&&(paginas+=1);for(var pages=[],i=0;i<paginas;i++)pages.push(i+1);scope.paginas=pages},scope.mostrarPagina=function(pagina){$("section#app #content .paginas ul li, html section#app #content .paginas ul li").removeClass("active"),$(".pagina_"+pagina).addClass("active");for(var inicio=(pagina-1)*scope.itemsxpagina,fin=inicio+scope.itemsxpagina,datos=[],i=inicio;i<fin;i++)null!=scope.data[i]&&datos.push(scope.data[i]);scope.dataPagina=datos},scope.verCategoria=function(e){var categoria=$(this)[0].categoria.label;"Terror"==categoria&&(categoria="horror"),"Comedia"==categoria&&(categoria="comedy"),"Drama"==categoria&&(categoria="drama");var arrExiste=[];$.each(scope.dataGlobal,function(index,value){cat=value.categories[0],cat==categoria&&arrExiste.push(value)}),refrescarPagina(arrExiste)},scope.verEdicion=function(e,id){var arrExiste=[];$.each(scope.dataGlobal,function(index,value){ediciones=value.mode,$.each(ediciones,function(i,v){id==v&&arrExiste.push(value)})}),refrescarPagina(arrExiste)},scope.verIdiomas=function(e,id){var arrExiste=[];$.each(scope.dataGlobal,function(index,value){idiomas=value.lang,$.each(idiomas,function(i,v){id==v&&arrExiste.push(value)})}),refrescarPagina(arrExiste)},scope.buscarTexto=function(){var texto=$("#txtSearch").val(),arrExiste=(urlService.getUrl(),[]);$.each(scope.dataGlobal,function(index,value){titulo=value.title,tituloM=titulo.toUpperCase(),tituloM.search(texto.toUpperCase())>-1&&arrExiste.push(value)}),refrescarPagina(arrExiste)},scope.guardarBusqueda=function(){var texto=$("#txtSearch").val(),obj=new Object;obj.url="",obj.label=texto,scope.guardados.push(obj)},scope.obtenerGuardado=function(){var txt=$(this)[0].guardado.label;$("#txtSearch").val(txt)},scope.mostrarTodos=function(){scope.cargar(cargarData)},scope.cargar(mostrarCategorias),scope.cargar(mostrarIdiomas),scope.cargar(mostrarPresentaciones),scope.cargar(mostrarGuardados),scope.cargar(cargarData),scope.mostrarTodos()}]),app.service("urlService",function(){this.getUrl=function(funcion){return"data/books-schema.json"}}),app.service("proceso",["$http",function(http){this.procesar=function(url,dato,retorno,ext){result=http.post(url,dato),result.then(function(response){retorno(response.data,ext)}),result.catch(function(error){})},this.procesar2=function(url,dato,retorno,ext){txt=localStorage.getItem("data"),txt2=JSON.parse(txt),retorno(txt2)}}]);