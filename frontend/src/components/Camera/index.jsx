import React, { useState } from 'react';

// TODO https://github.com/rpldy/react-uploady
// TODO https://stackoverflow.com/questions/43692479/how-to-upload-an-image-in-react-js
const ImageUploader = () => {
  const [image, setImage] = useState(null);

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };

  return (
    <div>
      <div>
        <div>
          <img src={image} alt='' />
          <h1>Select Image</h1>
          <input type='file' name='myImage' onChange={onImageChange} />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
