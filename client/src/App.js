import React from "react";
import "./App.css";

const dummyTranscriptData = [
  ["self", "¡Hola Y!"],
  ["other", "¡Hola X¡ ¿Cómo estás?"],
  ["self", "Muy bien ¿y tú?"],
  ["other", "bien, también."],
  ["other", "Tengo ganas de ir a ver una película ¿quieres ir conmigo?"],
  ["self", "Me encantaría. ¿cuándo?"],
  ["other", "Puede ser el miércoles."],
  [
    "self",
    "No, es imposible, tengo que trabajar todo el día. ¿Qué tal el lunes?",
  ],
];

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
        {dummyTranscriptData.map((data) => {
          const isSelf = data[0] === "self";
          const transcript = data[1];
          return <TranscriptRow text={transcript} isForSelf={isSelf} />;
        })}
      </div>
    </div>
  );
}

export default App;
