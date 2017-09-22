
DesignSE - lightboxSE is small lightbox alternative with lots of options.  It can handle just about
any type of media, and is easy to customize via CSS.

Copyright Geoff Squires (bredlen@yahoo.ca)

Distributed under the MIT license (http://opensource.org/licenses/MIT)


google groups:			https://groups.google.com/forum/#!forum/lightboxse-support-forum



Usage:

<BODY>

		<h2> Individual Images </h2>
		<a href="media/PIC_01.jpg" data-lightbox="true" data-slideshow="1" data-caption="this is a test of the emergency broadcast system">Image 1</a>

		<h2> Misc Content </h2>
		<a href="http://www.wikipedia.org" data-lightbox="true" data-size="600, 600" > ( Website )</a>

	<script type='text/javascript' src="scripts/jquery-1.10.2.min.js"></script>
	<script type='text/javascript' src="scripts/jsFlashVer.js"></script>
	<script type='text/javascript' src="scripts/lightboxSE.js"></script>
	
	<script type='text/javascript'>
		$(document).ready(function()
		{
			$('a[data-lightbox*=true]').lightboxSE({
				autoPlay:true
			 });
		})
	</script>

