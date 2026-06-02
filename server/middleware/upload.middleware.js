import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
const storage = new CloudinaryStorage({

  cloudinary,

  params: async (req, file) => {

   const isVideo =
  file.mimetype.startsWith('video');

const isAudio =
  file.mimetype.startsWith('audio');

   return {

  folder: 'syncly',

  resource_type:
    isVideo || isAudio
      ? 'video'
      : 'image',

  allowed_formats:
    isVideo
      ? ['mp4', 'webm', 'mov']
      : isAudio
        ? ['mp3', 'wav', 'ogg']
        : [
            'jpg',
            'jpeg',
            'png',
            'webp',
            'gif'
          ],

  transformation:
    isVideo || isAudio
      ? []
      : [{ quality: 'auto' }]

};

  }

});
export const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });
 