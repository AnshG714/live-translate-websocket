import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { v4 } from "uuid";

const W3WebSocket = require("websocket").w3cwebsocket;

const TAGS = [
  "[ASR]",
  "[SASR]",
  "[SRC]",
  "[SSRC]",
  "[TGT]",
  "[STGT]",
  "<self/>",
  "<other/>",
  "[final]",
  "[int]",
];

RegExp.escape = function (s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

function stripTag(text) {
  let ret = text;
  for (const tag of TAGS) {
    const re = RegExp(RegExp.escape(tag), "g");
    ret = ret.replace(re, "");
  }

  return ret.trim();
}

function debounce(func, timeout = 2000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function TranscriptRow({ text, isForSelf }) {
  return (
    <div
      className="transcript-row"
      style={{
        alignSelf: isForSelf ? "flex-end" : "flex-start",
        background: isForSelf ? "lightgreen" : "none",
      }}
    >
      <p>{text}</p>
    </div>
  );
}

function App() {
  const client = useRef(null);
  const [transcript, setTranscript] = useState([]);

  const handleMessage = (message) => {
    setTranscript((prevTranscript) => {
      const m = message.data;
      if (!(m.includes("[STGT]") || m.includes("[ASR]") || m.includes("[SRC]")))
        return prevTranscript;

      if (prevTranscript.length === 0) {
        return [m];
      }

      if (m.includes("[int]")) {
        // if we had a previous final, we need to create a new entry
        if (prevTranscript[prevTranscript.length - 1].includes("final")) {
          return [...prevTranscript, m];
        } else {
          return [...prevTranscript.slice(0, -1), m]; // otherwise just replace the previous entry
        }
      } else {
        // just replace the last intermediate
        return [...prevTranscript.slice(0, -1), m];
      }
    });
  };

  useEffect(() => {
    client.current = new W3WebSocket("ws://10.0.0.38:5000");
    client.current.onerror = () => {
      console.log("error");
    };

    client.current.onopen = () => {
      console.log("connected!!");
    };

    client.current.onclose = () => {
      console.log("closed");
    };

    client.current.onmessage = (message) => {
      // note: it doesn't handle interruptions well.
      handleMessage(message);
    };

    return () => {
      if (client.current.readyState === 1) {
        client.current.close();
      }
    };

    // Need to disable this lint to prevent socket reconnections on every render.
    // eslint-disable react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          border: "1px solid gray",
          padding: 10,
          borderRadius: 10,
          background: "lightgray",
        }}
      >
        {transcript.map((transcriptItem, index) => {
          const isSelf = transcriptItem.includes("[STGT]");
          const strippedTranscriptItem = stripTag(transcriptItem);
          // if (!transcriptItem) return null;
          return (
            <TranscriptRow
              key={index}
              text={strippedTranscriptItem}
              isForSelf={isSelf}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
