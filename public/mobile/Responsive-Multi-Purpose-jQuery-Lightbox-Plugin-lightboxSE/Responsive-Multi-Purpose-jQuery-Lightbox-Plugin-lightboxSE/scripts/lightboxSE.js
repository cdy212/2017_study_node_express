/* LightboxSE is a small, simple lightbox alternative      */
/* Copyright Geoff Squires                           	   */
/* licensed under MIT  http://opensource.org/licenses/MIT  */

(function($)
{
    jQuery.fn.lightboxSE = function( settings )
    {
		this.click(function() 
    	{
			Initialise(this);
	        return false;
    	}); 
		      
        settings = jQuery.extend(
        {
			animateLightbox:		true,				// animate opening and closing the lightbox

			autoPlay:				true,				// auto play the slideshow

            backgroundClickable: 	true,				// does clicking on the background close the lightbox

			backgroundOpacity:		'0.6',				// opacity of the background

			keyboard:				true,				// whether or not to capture right and left key for next and previous
			
			overlayer:				true,				// whether or not to create an overlayer to prevent image grab
			
			showCaptionBar:			true,				// show caption bar or not when caption present

			showCaptionBarAlways:	false,				// show the caption regardless of caption or not
			
			showPlayPause:			true,				// show the play / pause buttons
			
			showPrevNext:			true,				// show the prev / next buttons
			
			slideshowTime:			4000,				// timer in milliseconds for slideshow - set to 0 for no timer

            showToolTip: 			true,				// true, false - show the tool tips

            closeToolTip: 			'Close (Esc)',

            nextToolTip: 			'Next (>)',

            pauseToolTip: 			'Pause',

            playToolTip: 			'Play',

            prevToolTip: 			'Previous (<)'

        }, settings);



        var content = 
        { 
            Image:0,
            Iframe:1,
            Flash:2,
            QuickTime:3
        };
		
		
		function Initialise(anchor)
		{
			var imageArray = new Array();
			var captionArray = new Array();
			var dimensionArray = new Array();
				
			var curSlide = 0;
			var slideshow = false;
			var slideshowPlay = settings.autoPlay;
			var slideshowTime = settings.slideshowTime;
			
			var contentType = 0;
		
			var slideTimer = 0;
			var slidePlaying = false;		
		
			/* determine if single or multiple items */
			var collection = $(anchor).attr('data-slideshow');
			imageArray.length = 0;
			captionArray.length = 0;
			dimensionArray.length = 0;
						
			if(!collection) // single item
			{
				imageArray.push($(anchor).attr('href'));
					
				if($(anchor).attr('data-caption'))
				{
					captionArray.push($(anchor).attr('data-caption'));
				}
				else
				{
					captionArray.push('');
				}
						
				if($(anchor).attr('data-size'))
				{
					dimensionArray.push($(anchor).attr('data-size'));
				}
				else
				{
					dimensionArray.push('');
				}
				slideshowTime = 0;
			}
			else // multiple items - slideshow
			{
				slideshow = true;
				
				var thisSlidePosition = 0;
				$('a').each( function()
				{
					if($(this).attr('data-lightbox'))
					{
						if($(this).attr('data-slideshow'))
						{
							if($(this).attr('data-slideshow') == collection)
							{
								imageArray.push($(this).attr('href'));
								
								if($(this).attr('data-caption'))
								{
									captionArray.push($(this).attr('data-caption'));
								}
								else
								{
									captionArray.push('');
								}
								
								if($(this).attr('data-size'))
								{
									dimensionArray.push($(this).attr('data-size'));
								}
								else
								{
									dimensionArray.push('');
								}
								
								if($(this).attr('href') == $(anchor).attr('href')) // current slide
								{
									curSlide = thisSlidePosition;
								}									
								thisSlidePosition++;
							}
						}
					}
				});
			}		
			/* ------------------------------------- */

			$('body').append('<div id="lightboxSE" style="position:absolute; left:0; width:100%; height:100%; top:' + pageYOffset + 'px;"></div>');
//			$('body').append('<div id="lightboxSE" style="width:100%; height:100%;"></div>');
			var lightboxSE = $('#lightboxSE', 'body');
			
			/* create background ----------------------- */
            lightboxSE.append('<div id="lightbox_background" class="lightboxBackground"></div>');
			if(settings.animateLightbox)
			{
				$('#lightbox_background', lightboxSE).animate({'opacity':settings.backgroundOpacity, '-moz-opacity':settings.backgroundOpacity, 'filter:alpha:opacity':(settings.backgroundOpacity*100)	}, 300);
			}
			else
			{
				$('#lightbox_background', lightboxSE).css({'opacity':settings.backgroundOpacity, '-moz-opacity':settings.backgroundOpacity, 'filter:alpha:opacity':(settings.backgroundOpacity*100)});
			}
            
			if(settings.backgroundClickable)
			{
				$('#lightbox_background', lightboxSE).click(function()
				{
					closeLightbox();
				});
			}
			/* ----------------------------------------- */
						
			
			lightboxSE.append('<div id="lightbox" class="lightbox" style="position:absolute; left:50%; width:0px; top:50%; height:0px;"></div>');
			var lightbox = $('#lightbox', lightboxSE);
			/* -------------------------------- */
			
			
			/* add controls & content ----------------------------------------- */

			// add close button
			if(settings.showToolTip) lightboxSE.append('<div id="lightboxCloseButton" class="lightboxCloseButton" title="' + settings.closeToolTip + '" style="visibility:hidden;"></div>');
			else lightboxSE.append('<div id="lightboxCloseButton" class="lightboxCloseButton" style="visibility:hidden;"></div>');
			
			$('#lightboxCloseButton', lightboxSE).click(function()
			{
				closeLightbox();
			});


			// add caption bar
			lightbox.append('<div id="lightboxCaptionBar" class="lightboxCaptionBar" style="visibility:hidden;"></div>');
								
				
			// add prev / next buttons
			if(settings.showPrevNext && slideshow)
			{
				if(settings.showToolTip) lightbox.append('<div id="lightboxPrevButton" class="lightboxPrevButton" title="' + settings.prevToolTip + '" style="visibility:hidden;"></div>');
				else lightbox.append('<div id="lightboxPrevButton" class="lightboxPrevButton" style="visibility:hidden;"></div>');
			
				$('#lightboxPrevButton', lightbox).click(function()
				{
					PrevSlide();
				});


				if(settings.showToolTip) lightbox.append('<div id="lightboxNextButton" class="lightboxNextButton" title="' + settings.nextToolTip + '" style="visibility:hidden;"></div>');
				else lightbox.append('<div id="lightboxNextButton" class="lightboxNextButton" style="visibility:hidden;"></div>');
			
				$('#lightboxNextButton', lightbox).click(function()
				{
					NextSlide();
				});
			}


			// add play / pause buttons
			if(settings.showPlayPause && slideshow)
			{
				if(settings.showToolTip) lightbox.append('<div id="lightboxPlayButton" class="lightboxPlayButton" title="' + settings.playToolTip + '" style="visibility:hidden;"></div>');
				else lightbox.append('<div id="lightboxPlayButton" class="lightboxPlayButton" style="visibility:hidden;"></div>');
			
				$('#lightboxPlayButton', lightbox).click(function()
				{
					slideshowPlay = true;
					StartSlideTimer();
					$('#lightboxPlayButton', lightbox).css('visibility', 'hidden');
					$('#lightboxPauseButton', lightbox).css('visibility', 'visible');
				});


				if(settings.showToolTip) lightbox.append('<div id="lightboxPauseButton" class="lightboxPauseButton" title="' + settings.pauseToolTip + '" style="visibility:hidden;"></div>');
				else lightbox.append('<div id="lightboxPauseButton" class="lightboxPauseButton" style="visibility:hidden;"></div>');
		
				$('#lightboxPauseButton', lightbox).click(function()
				{
					slideshowPlay = false;
					StopSlideTimer();
					$('#lightboxPlayButton', lightbox).css('visibility', 'visible');
					$('#lightboxPauseButton', lightbox).css('visibility', 'hidden');
				});
			}
			/* ---------------------------------------------------- */

			/* keyboard shortcuts */
			if(settings.keyboard)
			{
	            $(document).bind('keyup', function(e) 
    	        { 
			        if(e == null) keycode = event.keyCode; // IE			        
            	    else keycode = e.which;  // Mozilla
			        
			    	if( keycode == 27 ) closeLightbox();

					if(imageArray.length > 0)
					{
				        switch( keycode )   
				        {
			    	         case 190: 
			        	     case 39:  NextSlide();    break; 
			             
			            	 case 188: 
				             case 37:  PrevSlide();    break;
				        } 
				    }
            	});
            }
			/* ---------------------- */
			
			
			lightbox.append('<div id="lightboxContent" class="lightboxContent"></div>');

			loadContent();


			/* ---------------------------------------------------- */
			var loading = false;
			function loadContent()
			{
				loading = true;
				contentType = content.Image;
				
				// determine content type
	            var urlType = imageArray[curSlide].toLowerCase().slice(imageArray[curSlide].lastIndexOf( '.' ));

	            switch( urlType )
    	        {
        	        case '.jpg':
            	    case '.jpeg':
                	case '.png':
	                case '.gif':
    	            case '.bmp':	contentType = content.Image;		break;
	                case '.swf':	contentType = content.Flash;	  	break;
            	    case '.mov':	contentType = content.QuickTime;	break;
					default:		contentType = content.Iframe;		break;
	            }

				if(contentType == content.Image)
				{
					// are dimensions given?
					if(dimensionArray[curSlide].length > 0)
					{
						// override image dimensions
						var dims = dimensionArray[curSlide];
						var newDims = dims.split(',');
						
						resizeLightbox(newDims[0], newDims[1]);
					}
					else
					{
		                var image = new Image();
        		        image.onload = function() 
                		{
							resizeLightbox(this.width, this.height);	
						}
						image.src = imageArray[curSlide];
		            }
				}
				else
				{
					var dims = dimensionArray[curSlide];
					var newDims = dims.split(',');
						
					resizeLightbox(newDims[0], newDims[1]);
				}
				if(slideshowPlay) StartSlideTimer();	
			}
			
			
			/* resize lightbox to match image or data-size */
			function resizeLightbox(newWidth, newHeight)
			{
				// make sure it fits in the screen
				if(newWidth > ($(window).width() * 0.8))
				{
					var aspect = newWidth / newHeight;

					newWidth = Math.round($(window).width() * 0.8);
					newHeight = Math.round(newWidth / aspect);
				}					

				if(newHeight > ($(window).height() * 0.8))
				{
					var aspect = newWidth / newHeight;
					
					newHeight = Math.round($(window).height() * 0.8);
					newWidth = Math.round(newHeight * aspect);
				}

				var setLeft = Math.round(($('#lightbox_background', lightboxSE).width()/2) - (newWidth/2));
				var setTop = Math.round(($('#lightbox_background', lightboxSE).height()/2) - (newHeight/2));
				
				if(settings.animateLightbox)
				{
					lightbox.animate({	width: newWidth,	height: newHeight,	left: setLeft,	top: setTop		}, 200, function()
					{
						showControls();
						showContent();
					});						
				}
				else lightbox.animate({	width: newWidth,	height: newHeight,	left: setLeft,	top: setTop		}, 1, function()
				{
					showControls();
					showContent();
				});
			}

						
			function showControls()
			{
				var lightboxPosition = lightbox.position();

				var closeLeft = lightboxPosition.left + lightbox.width();
				var closeTop = lightboxPosition.top;
				$('#lightboxCloseButton').css('left', closeLeft);
				$('#lightboxCloseButton').css('top', closeTop);
				$('#lightboxCloseButton').css('visibility', 'visible');
				
				// add caption bar
				if((settings.showCaptionBar && captionArray[curSlide].length) || settings.showCaptionBarAlways)
				{
					$('#lightboxCaptionBar').css('visibility', 'visible');
				}
				
				// add prev / next buttons
				if(settings.showPrevNext && slideshow)
				{
					var prevLeft = lightbox.width();
					var prevTop = lightbox.height();

					$('#lightboxPrevButton').css('left', prevLeft);
					$('#lightboxPrevButton').css('top', prevTop);
					$('#lightboxPrevButton').css('visibility', 'visible');


					var nextLeft = lightbox.width();
					var nextTop = lightbox.height();

					$('#lightboxNextButton', lightbox).css('left', nextLeft);
					$('#lightboxNextButton', lightbox).css('top', nextTop);
					$('#lightboxNextButton', lightbox).css('visibility', 'visible');
				}


				// add play / pause buttons
				if(settings.showPlayPause && slideshow)
				{
					var playLeft = lightbox.width();
					var playTop = lightbox.height();

					$('#lightboxPlayButton', lightbox).css('left', playLeft);
					$('#lightboxPlayButton', lightbox).css('top', playTop);
			

					$('#lightboxPauseButton').css('left', playLeft);
					$('#lightboxPauseButton').css('top', playTop);
					if(slideshowPlay) $('#lightboxPauseButton').css('visibility', 'visible');
					else $('#lightboxPlayButton', lightbox).css('visibility', 'visible');
				}
			}
			
			
			function hideControls()
			{
				$('#lightboxCloseButton', lightboxSE).css('visibility', 'hidden');
				$('#lightboxCaptionBar', lightbox).css('visibility', 'hidden');
				$('#lightboxPrevButton', lightbox).css('visibility', 'hidden');
				$('#lightboxNextButton', lightbox).css('visibility', 'hidden');
				$('#lightboxPlayButton', lightbox).css('visibility', 'hidden');
				$('#lightboxPauseButton', lightbox).css('visibility', 'hidden');
			}
						
			
			function showContent()
			{
				// add caption
				if(captionArray[curSlide].length)
				{
					lightbox.append('<div id="lightboxCaptionText" class="lightboxCaptionText">' + captionArray[curSlide] + '</div>');
				}


	            switch(contentType)
    	        {
        	        case content.Image: $('#lightboxContent', lightbox).append('<img id="lightboxInnerContent" src="' + imageArray[curSlide] + '" style="width:100%; height:100%; filter:alpha(opacity=0); opacity:0;' +
        	        					  '-moz-opacity:0;"/>');
        	        					var temp = $('#lightboxContent', lightbox);
										$('#lightboxInnerContent', temp).animate({'opacity':1, '-moz-opacity':1, 'filter:alpha:opacity':100}, 300);
										
										if(settings.overlayer) $('#lightboxContent', lightbox).append('<div id="lightboxOverlayer" class="lightboxOverlayer"></div>');
										break;
											
											
    	            case content.Iframe:	$('#lightboxContent', lightbox).append( '<iframe id="lightboxInnerContent" src="' + imageArray[curSlide] + '" class="lightboxIFrameContent"/>' );
											$('#lightboxPauseButton', lightbox).css('visibility', 'hidden');
											$('#lightboxPlayButton', lightbox).css('visibility', 'visible');
     					       	        	StopSlideTimer();
											break;


					case content.Flash:
                        if( DetectFlashVer( 8, 0, 0 ) )
                        {
                            var strFlashObject = '<div id="lightboxInnerContent"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                            strFlashObject += 'codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab" ';
                            strFlashObject += 'id="lightbox_flashobj" ';
                            strFlashObject += 'width="' + lightbox.width() + 'px" ';
                            strFlashObject += 'height="' + lightbox.height() + 'px">';
  			                strFlashObject += '<param name="movie" value="' + imageArray[curSlide] + '"/>'
  			                strFlashObject += '<param name="quality" value="high"/>';
  			                strFlashObject += '<param name="wmode" value="transparent"/>';
							strFlashObject += '<embed src="' + imageArray[curSlide] + '" ';
                            strFlashObject += 'quality="high" '; 
                            strFlashObject += 'type="application/x-shockwave-flash" ';
                            strFlashObject += 'pluginspage="http://www.macromedia.com/go/getflashplayer" ';
                            strFlashObject += 'width="' + lightbox.width() + 'px" ';
                            strFlashObject += 'height="' + lightbox.height() + 'px"></embed>';
                            strFlashObject += '</object></div>';

                           $('#lightboxContent', lightbox).append( strFlashObject );
                        }
                        else
                        {
                            $('#lightboxContent', lightbox).append( '<div id="lightboxInnerContent"/>An old version of the Flash plugin was detected. <strong><a href="http://www.macromedia.com/go/getflash/">Please upgrade your Flash plugin.<\/a><\/strong><\/div>' );
                        }
                        StopPlayTimer();
						break;					
                }
				loading = false;
			}


			function NextSlide()
			{
				if(!loading)
				{
					StopSlideTimer();
				
					curSlide++;
					if(curSlide >= imageArray.length) curSlide = 0;

					hideControls();
				
					$('#lightboxCaptionText', lightbox).remove();
					$('#lightboxInnerContent', lightbox).remove();
					if(settings.overlayer) $('#lightboxOverlayer', lightbox).remove();
				
					loadContent();				
				}
			}


			function PrevSlide()
			{
				if(!loading)
				{
					StopSlideTimer();

					curSlide--;
					if(curSlide < 0) curSlide = imageArray.length-1;
				
					hideControls();
				
					$('#lightboxCaptionText', lightbox).remove();
					$('#lightboxInnerContent', lightbox).remove();
					if(settings.overlayer) $('#lightboxOverlayer', lightbox).remove();
				
					loadContent();	
				}
			}			


	        function StartSlideTimer()
    	    {
        	    if(!slidePlaying && slideshowTime > 0)
            	{
                	slidePlaying = true;
                
    	            slideTimer = setInterval( OnSlideTimer, slideshowTime );
        	    }
        	}


			function StopSlideTimer()
			{
				if(slidePlaying)
				{
					slidePlaying = false;
					
					clearInterval(slideTimer);
				}
			}
			
			
			function OnSlideTimer()
			{
				NextSlide();
			}
			

			function closeLightbox()
			{
				StopSlideTimer();
				hideControls();

				if(settings.keyboard)
				{
	    	        $(document).unbind('keyup');
				}
			
				$('#lightboxCloseButton', lightboxSE).unbind('click');
				$('#lightboxPrevButton', lightbox).unbind('click');
				$('#lightboxNextButton', lightbox).unbind('click');
				$('#lightboxPlayButton', lightbox).unbind('click');
				$('#lightboxPauseButton', lightbox).unbind('click');
				$('#lightbox_background', lightboxSE).unbind('click');

				if(settings.animateLightbox)
				{
					lightbox.animate({ width: 0, height: 0, left: '50%', top: '50%', 'opacity':0 }, 200, function()
					{
						$('#lightbox_background', lightboxSE).animate({'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0}, 200, function()
						{
							lightboxSE.remove();
						});
					});
				}
				else
				{
					lightboxSE.remove();
				}
			}
		}		
	}
})(jQuery);
     

