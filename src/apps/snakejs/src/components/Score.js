import React from "react";

import '../styles/Score.css';

export default class Score extends React.Component {

  render () {
    console.log(this.props.highScore);
    const data = [];
    for (let index in this.props.highScore)
      data.push(this.props.highScore[index]);
    
    const highScore = data.map((value, index) => {
      return <div key = {index}>{value.name}: {value.score}</div>
    });

    return (
      <div className = "snake-score">
        <h1>{"Score: " + this.props.score}</h1>
        {this.props.gameOver ? <h3>Game Over! Better luck next time! <br/> Your score: {this.props.previousScore} </h3> : null }

        <br />
        Press any key to start
        <br /><br />
        Use W  A  S  D or Numpad Arrow Keys to move
        <br /> <br />

        <h2>High Scores</h2>
        {highScore}
      </div>
    );
  }
};
