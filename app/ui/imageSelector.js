'use client'

import { useState } from "react";
import Image from "next/image"

export default () => {
    const [image, setImage] = useState('/example.png');

    function preview(e) {
        setImage(URL.createObjectURL(e.target.files[0]));
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