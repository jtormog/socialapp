'use client'

export async function compressImage(file) {
    // If file is less than 1MB, return original file
    if (file.size <= 1024 * 1024) {
        return file;
    }

    // Create an image object
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise((resolve) => {
        img.onload = () => {
            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            const maxDimension = 1920; // Max dimension for compressed image

            if (width > height && width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
            } else if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to blob
            canvas.toBlob(
                (blob) => {
                    // Clean up object URL
                    URL.revokeObjectURL(img.src);
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    }));
                },
                'image/jpeg',
                0.8 // Quality setting (0.8 = 80% quality)
            );
        };
    });
}