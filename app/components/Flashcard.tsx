import { useState } from "react";
import type { FC } from "react";
import Card from "@mui/material/Card";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Flashcard: FC<{ word: any }> = ({ word }) => {
  const [flipped, setFlipped] = useState(false);

  const hungarian = word.word;
  const english = word.eng;

  const flipCard = () => {
    setFlipped(!flipped);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form method="POST" action="/?index">
        <Card
          style={{
            marginLeft: 150,
            marginRight: 150,
            padding: 20,
            width: 300,
            height: 350,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
          }}
          onClick={flipCard}
        >
          {flipped ? <h1>{english}</h1> : <h1>{hungarian}</h1>}
        </Card>
        <input type="hidden" name="wordId" value={word.id} />
        <button>
          <ArrowForwardIosIcon fontSize="large" />
        </button>
      </form>
    </div>
  );
};

export default Flashcard;
