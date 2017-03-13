var app=angular.module("finder", []);
app.controller('appController',["$scope","urlService","proceso",function(scope,urlService,proceso){
	//DECLARACIONES INICIALES
	scope.itemCategoria=$("html section#app #aside .item_aside.categorias ul li.child a");
	scope.categorias=[];
	scope.idiomas=[];
	scope.presentaciones=[];
	scope.guardados=[];
	scope.dataGlobal=[];
	scope.data=[];
	scope.dataPagina=[];
	scope.paginas=[];
	scope.itemsxpagina=9;
	$("section#app #aside .item_aside ul li.todos").on('click',function(){
		window.history.pushState('', '', "/finder_challenge/");
	})
	$("#txtSearch").keyup(function(){
		var characterReg = /[`~!@#$%^&*()_°¬|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
		var inputVal = $(this).val();
		if(characterReg.test(inputVal)) {			
			$(this).val(inputVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''));
		}		
	});	
	//funciones iniciales
	scope.cargar=function(func)
	{
		var url=urlService.getUrl();
		var dato='';
		var existe=localStorage.getItem('existe');
		proceso.procesar(url,dato,func);
	}
	function mostrarCategorias(data)
	{		
		scope.categorias=data.entities.categories[0];
	}
	function mostrarIdiomas(data)
	{		
		scope.idiomas=data.entities.lang[0];
	}
	function mostrarPresentaciones(data)
	{		
		scope.presentaciones=data.entities.edition[0];
	}
	function mostrarGuardados(data)
	{		
		scope.guardados=data.entities.saved;
	}
	function cargarData(data)
	{
		scope.dataGlobal=data.data;
		scope.data=data.data;
		scope.paginacion(scope.data.length);
		scope.mostrarPagina(1);
	}
	//mostrar cantidad de paginas
	scope.paginacion=function(cantidad)
	{
		var paginas=parseInt(cantidad/scope.itemsxpagina);
		var resto=cantidad%scope.itemsxpagina;
		if(resto > 0){
			paginas=paginas+1;
		}
		var pages=[];
		for(var i=0;i < paginas; i++){
			pages.push(i+1)
		}
		scope.paginas=pages;
	}
	//mostrar elementos por cada página
	scope.mostrarPagina=function(pagina)
	{	
		$("section#app #content .paginas ul li, html section#app #content .paginas ul li").removeClass('active');
		$(".pagina_"+pagina).addClass('active');
		var inicio=(pagina-1)*scope.itemsxpagina;
		var fin=inicio+scope.itemsxpagina;
		var datos=[];
		for (var i = inicio; i < fin ; i++) {
			if(scope.data[i]==null){
				continue;
			}else{
				datos.push(scope.data[i]);
			}			
		}
		scope.dataPagina=datos;
	}	
	//muestra los registros filtrados por categoría
	scope.verCategoria=function(e)
	{
		var categoria=$(this)[0].categoria.label;
		if(categoria=="Terror"){
			categoria='horror';
		}
		if(categoria=="Comedia"){
			categoria='comedy';
		}
		if(categoria=="Drama"){
			categoria='drama';
		}
		var arrExiste=[];
		$.each(scope.dataGlobal,function(index,value){
			cat=value.categories[0];
			if(cat== categoria){
				arrExiste.push(value);
			}
		});
		console.log(arrExiste)
		refrescarPagina(arrExiste);
	}
	//muestra los registros filtrados por edición
	scope.verEdicion=function(e,id)
	{		
		var arrExiste=[];
		$.each(scope.dataGlobal,function(index,value){
			ediciones=value.mode;
			$.each(ediciones,function(i,v){
				if(id==v){
					arrExiste.push(value);
				}
			});
		});		
		refrescarPagina(arrExiste);
	}
	//muestra los registros filtrados por idioma
	scope.verIdiomas=function(e,id)
	{		
		var arrExiste=[];
		$.each(scope.dataGlobal,function(index,value){
			idiomas=value.lang;
			$.each(idiomas,function(i,v){
				if(id==v){
					arrExiste.push(value);
				}
			});
		});		
		refrescarPagina(arrExiste);
	}
	//muestra los registros filtrados por fecha
	scope.verFecha=function(e,fecha)
	{		
		var d = new Date();
		var fechaMin=restarFechas(d, -fecha);
		var arrExiste=[];
		$.each(scope.dataGlobal,function(index,value){
			fechaPub=value.date_pub;
			var dif=fechas(fechaPub,fechaMin);
			if(dif==1){
				arrExiste.push(value);
			}
		});	
		refrescarPagina(arrExiste);
	}
	//función que calcula la fecha según la opción seleccionada
	function restarFechas(fecha, dias){
		var fecha = new Date();
		fecha.setDate(fecha.getDate() + dias);
		fecha=(fecha.getMonth() +1) + "/" + fecha.getDate() + "/" + fecha.getFullYear();
		return fecha;
	}
	//función que valida si la fecha de publicación esta en el rando de la fecha seleccionada con la fecha actual
	function fechas(fechaPub,fechaMin)
	{
		var fecha = new Date();
		var fechaHoy=fecha.getFullYear() + "/" + (fecha.getMonth() +1) + "/" + fecha.getDate();
		var fechaHoy=new Date(fechaHoy);
		
		valuesStart=fechaPub.split("/");
		valuesEnd=fechaMin.split("/");		
		fechaPub=new Date(valuesStart[2],(valuesStart[0]-1),valuesStart[1]);		
		fechaMin=new Date(valuesEnd[2],(valuesEnd[0]-1),valuesEnd[1]);		

		if(fechaPub >= fechaMin && fechaPub <= fechaHoy)
		{
			return 1;
		}else{
			return 0;
		}
		
	}
	//muestra los registros, los cuales el título coincida con el texto ingresado
	scope.buscarTexto=function()
	{
		var texto=$("#txtSearch").val();
		var url=urlService.getUrl();
		var arrExiste=[];
		$.each(scope.dataGlobal,function(index,value){
			titulo=value.title;
			tituloM=titulo.toUpperCase();
			var pos=tituloM.search(texto.toUpperCase());
			if(pos > -1){
				arrExiste.push(value);
			}
		});		
		refrescarPagina(arrExiste);
	}	
	//guardar busqueda
	scope.guardarBusqueda=function()
	{
		var texto=$("#txtSearch").val();
		var obj=new Object();
		obj.url='';
		obj.label=texto;
		scope.guardados.push(obj)
		//Esta sección esta guardando unicamente en un arreglo, cuando se refresque la página quedará como esta inicialmente, podía haberlo hecho con localstorage pero no estaba muy seguro
	}
	scope.obtenerGuardado=function()
	{
		var txt=$(this)[0].guardado.label;
		$("#txtSearch").val(txt);
	}
	//otros
	scope.mostrarTodos=function()
	{
		scope.cargar(cargarData);
	}
	function refrescarPagina(arr)
	{
		scope.data=arr;
		scope.paginacion(scope.data.length);
		scope.mostrarPagina(1);
	}
	scope.cargar(mostrarCategorias);
	scope.cargar(mostrarIdiomas);
	scope.cargar(mostrarPresentaciones);
	scope.cargar(mostrarGuardados);
	scope.cargar(cargarData);
	scope.mostrarTodos();
}]);




/*SERVICES*/
app.service('urlService', function() {
	this.getUrl = function(funcion) {
		var url = "data/books-schema.json";
		return url;
	};
});
app.service('proceso', ['$http', function(http) {
	this.procesar = function(url,dato,retorno,ext) {
		result = http.post(url, dato);
		result.then(function(response) {
			retorno(response.data,ext);
		});
		result.catch(function(error){
			console.log(error);
		});
	};
}]);