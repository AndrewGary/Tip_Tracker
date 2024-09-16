"use client"
import { useState } from 'react';

export default function CameraComponent() {
  const [image, setImage] = useState(null);

  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="camera-container">
      {!image ? (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageCapture} // No `capture` attribute to allow selection from photos
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          />
        </>
      ) : (
        <>
          <img src={image} alt="Captured" className="w-full h-auto" />
          <button
            onClick={() => setImage(null)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Retake Photo
          </button>
        </>
      )}
    </div>
  );
}


// import { useEffect, useRef, useState } from 'react';

// export default function CameraComponent() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [imageData, setImageData] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const openCamera = async () => {
//       try {
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: {
//               facingMode: { ideal: 'environment' }, // Use back camera
//             },
//             audio: false, // No need for audio
//           });

//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         } else {
//           setError('Camera access is not supported on this device.');
//         }
//       } catch (err) {
//         setError('Failed to access camera: ' + err.message);
//       }
//     };

//     openCamera();

//     // Cleanup the stream when the component unmounts
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const stream = videoRef.current.srcObject;
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Capture the image from the video stream
//   const captureImage = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     if (canvas && video) {
//       const context = canvas.getContext('2d');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       // Draw the video frame onto the canvas
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const imageDataURL = canvas.toDataURL('image/png');
//       setImageData(imageDataURL);

//       // Stop the video stream after capturing the image
//       const stream = video.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//     }
//   };

//   return (
//     <div className="camera-container">
//       {error && <p className="error-message">{error}</p>}

//       {!imageData ? (
//         <>
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             style={{
//               width: 'auto',
//               height: '100vh',
//               maxHeight: '100%',
//               objectFit: 'cover',
//               transform: 'scaleX(-1)', // Flip horizontally if necessary
//             }}
//           />
//           <button
//             onClick={captureImage}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Capture Photo
//           </button>
//         </>
//       ) : (
//         <>
//           <img src={imageData} alt="Captured" className="w-full h-auto" />
//           <button
//             onClick={() => setImageData(null)}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//           >
//             Retake Photo
//           </button>
//         </>
//       )}

//       {/* Canvas element used to capture the image */}
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";

// const ImageCapture = () => {

//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [imageData, setImageData] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const openCamera = async () => {
//           try {
//             if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//               const stream = await navigator.mediaDevices.getUserMedia({
//                 video: {
//                     facingMode: 'environment'
//                 },
//                 audio: false, // No need for audio
//               });
    
//               if (videoRef.current) {
//                 videoRef.current.srcObject = stream;
//               }
//             } else {
//               setError('Camera access is not supported on this device.');
//             }
//           } catch (err) {
//             setError('Failed to access camera: ' + err.message);
//           }
//         };
    
//         openCamera();
    
//         // Cleanup the stream when the component unmounts
//         return () => {
//           if (videoRef.current && videoRef.current.srcObject) {
//             const stream = videoRef.current.srcObject;
//             const tracks = stream.getTracks();
//             tracks.forEach((track) => track.stop());
//           }
//         };
//       }, []);

//       const captureImage = () => {
//         const canvas = canvasRef.current;
//         const video = videoRef.current;
    
//         if (canvas && video) {
//           const context = canvas.getContext('2d');
//           canvas.width = video.videoWidth;
//           canvas.height = video.videoHeight;
//           context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//           const imageDataURL = canvas.toDataURL('image/png');
//           setImageData(imageDataURL);
    
//           // Stop the video stream after capturing the image
//           const stream = video.srcObject;
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       };

//       return (
//         <div className="camera-container">
//           {error && <p className="error-message">{error}</p>}
    
//           {!imageData ? (
//             <>
//               <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
//               <button
//                 onClick={captureImage}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//               >
//                 Capture Photo
//               </button>
//             </>
//           ) : (
//             <>
//               <img src={imageData} alt="Captured" className="w-full h-auto" />
//               <button
//                 onClick={() => setImageData(null)}
//                 className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
//               >
//                 Retake Photo
//               </button>
//             </>
//           )}
    
//           {/* Canvas element used to capture the image */}
//           <canvas ref={canvasRef} style={{ display: 'none' }} />
//         </div>
//       );
// }

// export default ImageCapture