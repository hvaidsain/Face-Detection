import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

var videoElement = document.getElementById("video");


function App() {
  const playerRef = useRef();

  const constraints = {
    audio: false,
    video: { facingMode: "user", width: 1280, height: 720 }
  };



  const streamCamVideo = () => {
    videoElement = document.getElementById("video");

    const webCamPromise = navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream=>{
          window.stream = stream;
          videoElement.srcObject = stream;
          return new Promise((resolve, reject) => {
            playerRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        })
        .catch((err)=>{
          console.log(err.name+":"+err.message);
          alert("Not Allowed to give test")
        })

        const modelPromise = cocoSsd.load();

        Promise.resolve(modelPromise)
        .then(values => {
          console.log(values);
          detectFrame(videoElement, values);
        })
        .catch(error => {
          console.error(error);
        });

  };

  const detectFrame = (video, model) => {
    let count = 0;
    model.detect(video).then(
      predictions => {
        // console.log(predictions);
        predictions.forEach(prediction => {
          if (prediction.class == "person" && prediction.score >= 0.4) {
            count++;
            alert("Person Detected")

          }
          //   console.log(prediction);
        });
        // console.log(count);
        if (count > 1) {
          
          alert("More Than One Person!!");

          
        }

        // this.renderPredictions(predictions);
        requestAnimationFrame(() => {
          detectFrame(video, model);
        });
      },
      error => {
        console.log("something went wrong");
        console.log(error);
      }
    );
  };


  useEffect(() => {
    streamCamVideo();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Detection</h2>
      <div >
      <video
        
        className="floating-video"
        id="video"
        autoPlay={true}
        ref={playerRef}
        width="200"
        height="200"
      ></video>
      </div>
      
    </div>
  );
}

export default App;
