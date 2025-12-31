const { uploadImage } = require('./config/cloudinary');
const path = require('path');
const fs = require('fs');

const frontendPath = 'd:\\NRT portpholio\\NRT FRONTEND';

const assetsToUpload = [
    { path: path.join(frontendPath, 'src/assets/NRT_LOGO-removebg-preview.png'), name: 'NRT_LOGO-removebg-preview.png' },
    { path: path.join(frontendPath, 'public/videos/circuit.mp4'), name: 'circuit.mp4' },
    { path: path.join(frontendPath, 'public/videos/coding.mp4'), name: 'coding.mp4' },
    { path: path.join(frontendPath, 'public/videos/globe.mp4'), name: 'globe.mp4' },
    { path: path.join(frontendPath, 'public/videos/network.mp4'), name: 'network.mp4' }
];

const migrate = async () => {
    console.log('Starting Migration...');
    const mapping = {};

    for (const asset of assetsToUpload) {
        if (fs.existsSync(asset.path)) {
            try {
                console.log(`Uploading ${asset.name}...`);
                const result = await uploadImage(asset.path);
                console.log(`Uploaded ${asset.name}`);
                mapping[asset.name] = result.secure_url;
            } catch (error) {
                console.error(`Failed to upload ${asset.name}:`, error.message);
            }
        } else {
            console.log(`Skipping ${asset.name} (not found)`);
        }
    }

    fs.writeFileSync('migration_map.json', JSON.stringify(mapping, null, 2));
    console.log('Migration Complete. Map saved.');
};

migrate();
