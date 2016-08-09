<%@ page contentType="text/html;charset=UTF-8" %>
<html>
    <head>
        <title>Waveform TSDB Visualization Experiments</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
       
	    <link rel="stylesheet" href="/cvrg-waveform-dynamic-display/static/css/jquery-ui-1.10.3.custom/redmond/jquery-ui-1.10.3.custom.css" type="text/css" />
	    <link rel="stylesheet" href="/cvrg-waveform-dynamic-display/static/css/bootstrap/bootstrap.min.css" type="text/css" />
	    <link rel="stylesheet" href="/cvrg-waveform-dynamic-display/static/css/bootstrap/bootstrap-theme.min.css" type="text/css" />
	    <link rel="stylesheet" href="/cvrg-waveform-dynamic-display/static/css/bootstrap/dspace-theme.css" type="text/css" />
	    <link rel="stylesheet" href="/cvrg-waveform-dynamic-display/static/gridstack/gridstack.css" type="text/css" />
        <link rel="search" type="application/opensearchdescription+xml" href="/open-search/description.xml" title="DSpace"/>
		<script type='text/javascript' src="/cvrg-waveform-dynamic-display/static/js/jquery/jquery-1.10.2.min.js"></script>
		<script type='text/javascript' src='/cvrg-waveform-dynamic-display/static/js/jquery/jquery-ui-1.10.3.custom.min.js'></script>
		<script type='text/javascript' src='/cvrg-waveform-dynamic-display/static/js/bootstrap/bootstrap.min.js'></script>
		<script type='text/javascript' src='/cvrg-waveform-dynamic-display/static/js/AutofillJavascript.js'></script> 
	   	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
	   	<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
	   	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
	   	<script src="//cdnjs.cloudflare.com/ajax/libs/dygraph/1.1.1/dygraph-combined.js"></script>
		<script src="/cvrg-waveform-dynamic-display/static/gridstack/gridstack.js"></script>
	    <script type="text/javascript" src="/cvrg-waveform-dynamic-display/static/js/synchronizer.js"> </script>    

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
  <script src="static/js/html5shiv.js"></script>
  <script src="static/js/respond.min.js"></script>
<![endif]-->
		
		<style>
			.littleNote{font-style: italic; font-size: 90%; color:#666;}
			#selectorBox {columns:2; -webkit-columns:2; -moz-columns:2;}
			#selectorID ul li {float:left; width:40%;}
			#collapseOptions {float:right;}
			.grid-stack {margin-bottom:20px; margin-top:20px;}
		</style>
    </head>
    <body class="undernavigation" onload="init()">
    
<%-- <%@ page import="edu.jhu.cvrg.servlet.FileCounter" %>
<% FileCounter fcc = new FileCounter();
	String numberOutputOne = fcc.sixSix; 
	String numberOutput = fcc.threeThree; %> --%>
    
<%-- <%@ page import="edu.jhu.cvrg.servlet.TSDBBacking" %> 
<%	
	TSDBBacking tdb = new TSDBBacking();
%> --%>

<a class="sr-only" href="#content"><%-- <%=numberOutput%> --%>Skip navigation<%-- <%=numberOutputOne%> --%></a>
<header class="navbar navbar-inverse navbar-fixed-top">    
    
            <div class="container">
                
       <div class="navbar-header">
         <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
         </button>
         <a class="navbar-brand" href="/"><img height="40px" src="../image/dspace-cvrg-logo-only.png" /></a>
       </div>
       <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
         <ul class="nav navbar-nav">
           <li class="active"><a href="/"><span class="glyphicon glyphicon-home"></span> Home</a></li>
                
       </ul>
       <div class="nav navbar-nav navbar-right">
		<ul class="nav navbar-nav navbar-right">
         <!-- <li class="dropdown">  
             <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span> Sign on to: <b class="caret"></b></a>
             <ul class="dropdown-menu">
               <li><a href="/mydspace">My EDDI</a></li>
               <li><a href="/subscribe">Receive email<br/>updates</a></li>
               <li><a href="/profile">Edit Profile</a></li>
             </ul>
           </li> -->
          </ul>
	<!-- <form method="get" action="/simple-search" class="navbar-form navbar-right" scope="search">
	    <div class="form-group">
          <input type="text" class="form-control" placeholder="Search&nbsp;EDDI" name="query" id="tequery" size="25"/>
        </div>
        <button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span></button>
	</form> --></div>
    </nav>
            </div>
</header>

<!-- <main id="content" role="main"> -->
         
<div class="container">
			<h3>Available Data <button type="button" id="collapseOptions" class="btn btn-sm btn-primary success"  data-toggle="collapse" data-target="#queryOptions" onclick="collapseControlText();">Hide Query Controls</button></h3>
			<div id="queryOptions" class="row in">
			<div class="container row" style="margin-top:5px;">
			<div id="queryBox" class="col-md-6">
				<form name="queryform"  action="tsdQuery">
				<p id="selectorBox"><strong>Lead: </strong><br/></p>
			</div>
			<div id="queryBox2" class="col-md-6">
					<p><strong>Subject Id: </strong><input type="text" size="10" id="subjectid-field" value="ncc1701A"> <span class="littleNote"> preset datasets to query against (try: ncc1701, ncc1701A, ncc1701B, ncc1701C, ncc1701D)</span></p>
				    <p><strong>Resolution: </strong><input type="text" size="10" id="sample-field" value="500"> <span class="littleNote"> approximate size of graph to render in pixels</span></p>
				    <p><strong>Start Time: </strong><input type="text" size="15" id="start-field" value="1420088400"><span class="littleNote"> unix time value: start is fixed at 1420088400</span></p>
				    <p><strong>End Time: </strong><input type="text" size="15" id="end-field" value="1420093382"><span class="littleNote">  unix time value: (5 min = 1420088700) (20 min = 1420089600) (40 min = 1420090200) 
(1:23 hours or threshold of information = 1420093382) (use 1420986800 as end for vitals)</span></p>
					<p><button type="button" class="btn btn-sm btn-success" onclick="doQuery();">Submit</button></p>
				</form>
			</div>
			</div>
			</div>
	        <div id="dataBox" class="col-md-12">
	            <h3>Displayed Data</h3>
				<div onmouseover="syncGraphs()" id="vitContainer" class="grid-stack" data-gs-width="12"></div>
				<div onmouseover="syncGraphs()" id="ecgContainer" class="grid-stack" data-gs-width="12"></div>
<!-- 				<button onclick="activateResize()">Click me</button> -->
			</div>
		<script>
		
			$(function() {
				
				var gridOptions = {
						animate : false, // turns animation on
						width : 12,     // amount of columns
						//height : 10,     // maximum rows amount
						item_class : 'grid-stack-item',     // widget class
						placeholder_class : 'grid-stack-placeholder',     // class for placeholder
						placeholderText : '',      // text for placeholder
						handle : '.grid-stack-item-content',     // draggable handle selector				
						handleClass : null,      // class for handle				
						cell_height : 60,     // one cell height
						vertical_margin : 20,     // vertical gap size
						auto : true,     // if false it tells to do not initialize existing items
						min_width : 768,    // minimal width.
						float : false,     // enable floating widgets
						vertical_margin : 20,    // vertical gap size
						static_grid : false,    // makes grid static
						always_show_resize_handle : true,   // if true the resizing handles are shown even the user is not hovering over the widget

						// allows to override jQuery UI draggable options
						draggable : {
							handle : '.draghandle',
							scroll : true,
							appendTo : 'body'
						},

						// allows to override jQuery UI resizable options
						resizable : {
							autoHide : false,
							handles : 'se'
						},
						disableDrag : false,     // disallows dragging of widgets
						disableResize : false,     // disallows resizing of widgets
						rtl : 'auto',     // if `true` turns grid to RTL.  Possible values are `true`, `false`, `'auto'`
						removable : true,     // if `true` widgets could be removed by dragging outside of the grid
						removeTimeout : 200      // time in milliseconds before widget is being removed while dragging outside of the grid
					};
				$('#vitContainer').gridstack(gridOptions);
				$('#ecgContainer').gridstack(gridOptions);
				
			});
		</script>
			</div>
			</div>
		</div>
<!-- </main> -->
<footer class="navbar navbar-inverse navbar-bottom trash">
	<div id="designedby" class="container text-muted">
		<div id="footer_feedback" class="pull-left">
			<p class="text-muted">Theme by <a href="http://www.cineca.it"><img src="../image/logo-cineca-small.png" alt="Logo CINECA" /></a></p>
		</div>
		<div id="footer_feedback" class="pull-right">
			<p class="text-muted"><a target="_blank" href="http://www.dspace.org/">DSpace Software</a> Copyright&nbsp;&copy;&nbsp;2002-2015&nbsp; <a target="_blank" href="http://www.duraspace.org/">Duraspace</a>&nbsp;-<a target="_blank" href="/feedback">Feedback</a> &nbsp;-&nbsp;<a
					href="/EDDI_help">Help</a></p>
		</div>
	</div>
</footer>
</body>
</html>