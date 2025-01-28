'use client'

import { useState } from "react";
import Image from "next/image"

export default () => {
    const [image, setImage] = useState('/placeholder.png');

    function preview(e) {
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const imageStyle = {
        width: 'auto',
        height: '100%'
    };

    return (
        <>
            <label htmlFor='myfs'>
                <Image
                    src={image}
                    alt="preview"
                    width={256}
                    height={256}
                    style={imageStyle}
                />
            </label>
            <input id='myfs' type="file" hidden accept="image/png, image/jpg, image/jpeg" name="media" required onChange={preview} />
        </>
    )
}