// handleUpload.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleUpload(fileBuffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image'
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

export async function handleDeleteMedia(publicId) {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    return result;
}

// Derive a Cloudinary public ID from a secure URL. The public ID is everything
// after the version segment (e.g. ".../upload/v123/folder/name.jpg" -> "folder/name"),
// including any folder prefix, minus the file extension. Returns null if it can't
// be parsed so callers can skip deletion rather than crash.
export function getCloudinaryPublicId(secureUrl) {
    if (!secureUrl || typeof secureUrl !== "string") return null;

    try {
        const { pathname } = new URL(secureUrl);
        // Split path and drop everything up to and including the "upload" segment.
        const parts = pathname.split("/");
        const uploadIdx = parts.indexOf("upload");
        let idParts = uploadIdx >= 0 ? parts.slice(uploadIdx + 1) : parts;

        // Drop a leading version segment like "v1712345678".
        if (idParts[0] && /^v\d+$/.test(idParts[0])) {
            idParts = idParts.slice(1);
        }

        if (idParts.length === 0) return null;

        const joined = idParts.join("/");
        // Strip the file extension from the last segment only.
        return joined.replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
}