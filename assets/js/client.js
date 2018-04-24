/*!
 * csv parser client js (vue js) for morningtrain
 * Copyright(c) 2018 Lijo E John
 * MIT Licensed
 */
 
var app = new Vue(
{
	//DOM element ID which the vue js init 
	el: '#app',
	// Application level data
	data: {
			columns:[] , //Table headers
			data: [], // Table data
			total: 0, // Total Records
			query: {}, //Query
			HeaderSettings:false, //Vue Data table property
			Pagination:false, //Vue Data table property
			application_api_url:"http://localhost:3000/file_upload", //node server end point
			files:"", //Uploaded files
			max_size:40960*1024, //In bytes 40 mb
			valid_ext:['csv',"vnd.ms-excel"] //Upload support file types
      },
	// methods that implement data logic.
	// note there's no DOM manipulation here at all.
	methods:
	{
		/**
		* @name init
		* @summary Function to init the client side page.
		* @param null
		* @returns null
		* @version    1.0
		* @author     Lijo E John <lijoejohn@gmail.com>
		*/
		init : function()
		{
			//For a demo use we are setting the static auth token here , on production env we will change this static token by logged in user token from the DB.
			Cookie.set('api_token', "$2y$10$whagl5tjn3JZkVjRLrTF6OoCLkyI0QS6QzsWaR7HEPLFTWBIyM69i", { expires: '1D' });
		},
		/**
		* @name load_file
		* @summary Function to load_file the csv data and update the UI.
		* @param {object} form data
		* @returns null
		* @version    1.0
		* @author     Lijo E John <lijoejohn@gmail.com>
		*/
		load_file : function(data)
        {
			//Display the loader
			app.show_loader();
			//Trigger the ajax call to the node js server.
        	$.ajax({
				        url: app.application_api_url,
				        type: 'POST',
				        data: data,
				        cache: false,
				        dataType: 'json',
				        processData: false, // Don't process the files
				        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				        beforeSend: function (xhr) { 
							//Set the Auth token in xhr header
					        xhr.setRequestHeader('Authorization', "Bearer "+Cookie.get('api_token')); 
					    },
				        success: function(data) 
						{ 
							//csv parsed successfully, Update the DOM.
				        	if (data.status == 1)
							{
								app.columns = data.headers; //Update vue data
								app.data = data.data; //Update vue data
								app.total = data.data.length; //Update vue data
								app.hide_loader();
							}
							//csv not parsed successfully, show the error info.
							else
							{
								$.notify({
								icon: 'pe-7s-gift',
								message: "Invalid token"
								},{
									type: 'info',
									timer: 4000
								});
								app.hide_loader();
							}
						}
			});
			
        },
		/**
		* @name check_file
		* @summary Function to validate the upload file (type,size).
		* @param {object} form element
		* @returns null
		* @version    1.0
		* @author     Lijo E John <lijoejohn@gmail.com>
		*/
		check_file :function(e)
		{
			var data 		= new FormData();
			app.files = e.target.files || e.dataTransfer.files;
			if (!app.files.length)
				return;
			if(typeof app.files != "undefined" && app.files.length) 
			{
				$.each(app.files, function(key, value)
				{
					if (value.size) 
					{
						//Check the file type and size
						if (app.valid_ext.indexOf(value.type.split("/")[1]) == -1 || value.size > app.max_size) 
						{
							$.notify({
								icon: 'pe-7s-gift',
								message: "Invalid File!"
							},{
								type: 'info',
								timer: 4000
							});
						}
						else
						{
							data.append("upload", value);
							//Trigger the csv upload function
							app.load_file(data);
						}
					}
					else //File is empty
					{
						$.notify({
								icon: 'pe-7s-gift',
								message: "File is too small to upload!"
							},{
								type: 'info',
								timer: 4000
							});
					}
					
				});
			}
		},
		/**
		* @name show_loader
		* @summary Function to show the blockUI loader.
		* @param null
		* @returns null.
		* @version    1.0
		* @author     Lijo E John <lijoejohn@gmail.com>
		*/
		show_loader: function ()
	    {
	    	if (!$(".loader").length) {
	    		$.blockUI({ message:'<div class="loader">Loading</div>'});
	    	}
	    },
		/**
		* @name hide_loader
		* @summary Function to hide the blockUI loader.
		* @param null
		* @returns null.
		* @version    1.0
		* @author     Lijo E John <lijoejohn@gmail.com>
		*/
	    hide_loader: function ()
	    {
	    	$.unblockUI();
	    },
	}
});