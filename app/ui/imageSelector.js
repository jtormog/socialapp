'use client'

import { useState } from "react";
import Image from "next/image"
import { compressImage } from "../lib/imageCompression";

export default () => {
    const [image, setImage] = useState('/example.png');

    async function preview(e) {
        const file = e.target.files[0];
        const compressedFile = await compressImage(file);
        setImage(URL.createObjectURL(compressedFile));
        // Replace the original file with the compressed one in the form
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(compressedFile);
        e.target.files = dataTransfer.files;
    }

    return (
        <>
            <label htmlFor='myfs'>
                <Image
                    src={image}
                    alt="preview"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-auto h-sm mx-auto"
                    style={{
                        maxHeight: "300px",
                        objectFit: "contain"
                    }}
                />
            </label>
            <input id='myfs' type="file" hidden accept="image/png, image/jpg, image/jpeg" name="media" required onChange={preview} />
        </>
    )
}