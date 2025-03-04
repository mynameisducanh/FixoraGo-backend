const cloudinary = require('cloudinary').v2;

function configureCloudinary() {
    cloudinary.config({ 
        cloud_name: 'di6tygnb5', 
        api_key: '663462546442577', 
        api_secret: 'lM_nHJvVtDIsAdS7A9XU1Rx4dec'
    });
}

module.exports = { cloudinary, configureCloudinary };