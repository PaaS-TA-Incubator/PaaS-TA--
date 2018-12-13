var glusterfs = require("../../glusterfs/glusterfs_processing");
var formidable = require('formidable');
var fs = require('fs');

exports.upload = function(req, res){   
	console.log('-> upload was called\n\n');
	var isImage = false;

	//EXPRESS.BODYPARSER 는 MULTIPART 를 위해 REQ.FILES를 만들어 줍니다.
	
	//var image = req.files.file;
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if (err)	console.log(err);
		else
		{
			var image = files.file;
		
			console.log('>>>>>>>>>>>\n'+JSON.stringify(files));
			console.log('->image:\n');
			console.log();
			var kb = image.size / 1024 | 0;
			isImage = checkType(image);
			console.log('-> isImage: ' + isImage );
	
			console.log('-> upload glusterfs');
			glusterfs.uploadImg(image, function(err, file){
				var filePath = file.client._serviceUrl + '/' + file.container + '/' + file.name;
				if (err)	res.status(400).json({err:err});
				else		res.status(200).json({thumb_img_path:filePath});
			});
		}
	});
};
 
function checkType(image){
	var isImage = false;
	console.log('->> image.type.indexOf : ' + image.type.indexOf('image'));
	//파일의 타입 비교
	if(image.type.indexOf('image') > -1){
		console.log('->>> req.files.file is img');
		isImage = true;
	}else{
		console.log('->>> req.files.file is not img');
		isImage = false;
	}
	return isImage;
}
