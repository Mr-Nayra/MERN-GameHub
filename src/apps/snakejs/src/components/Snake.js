import React from "react";

import Food from "./Food";
import Score from "./Score";

import '../styles/Snake.css'

const api = 'http://localhost:8888/api/snake';

const getRandomCoordinates = () => {
  const min = 1;
  const max = 98;
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
}

class SnakeBody extends React.Component {
  render () {
    const snakeBody = this.props.snakeDots.map((dot, index) => {
      const style = {
          left: `${dot[0]}%`,
          top:  `${dot[1]}%`
      };

      return <div className = "snake-dot" key = {index} style = {style}></div>
    });
    
    return (
      <div className = "snake-body">
        {snakeBody}
      </div>
    )
  }
};

export default class Snake extends React.Component {
  constructor (props) {
    super(props);

    this.defaultState = {
      speed: 100,
      food: getRandomCoordinates(),
      direction: 'RIGHT',
      snakeDots: [
        [0, 0],
        [2, 0],
        [4, 0]
      ],
      started: false,
      gameOver: false,
      previousScore: 0,
      highScore: 0
    };

    this.state = this.defaultState;

    this.moveSnake = this.moveSnake.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.GameOver = this.GameOver.bind(this);
  }

  componentDidMount () {
    document.addEventListener('keydown', this.onKeyDown, false);

    fetch(api)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({highScore: json});
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  componentDidUpdate(){
    if (!this.state.started)
      return;
    if (this.isOutOfBorders())
      this.GameOver();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown (event) {
    if (!this.state.started) {
      if (event.keyCode >= 48 && event.keyCode <= 127) {
        this.setState({started: true, gameOver: false});
        this.intervalHandle = setInterval(this.moveSnake, this.state.speed);
      }
    }
    else
      switch (event.keyCode) {
        case 104:
        case 87:
          if (!["UP", "DOWN"].includes(this.state.direction))
            this.setState({ direction: "UP" });
          break;
        
        case 101:
        case 83:
          if (!["UP", "DOWN"].includes(this.state.direction))
            this.setState({ direction: "DOWN" });
          break;
        
        case 100:
        case 65:
          if (!["LEFT", "RIGHT"].includes(this.state.direction))
            this.setState({ direction: "LEFT" });  
          break;
        
        case 102:
        case 68:
          if (!["LEFT", "RIGHT"].includes(this.state.direction))
            this.setState({ direction: "RIGHT" });
          break;
        
        default: break;
      }
  };

  moveSnake () {
    let dots = [...this.state.snakeDots];
    let head = dots.at(-1);

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      
      case 'UP':
        head = [head[0], head[1] - 2];
        break;  
      
      default: break;
    }

    dots.push(head);
    dots.shift();
    
    this.setState({
      snakeDots: dots
    });
  }

  isOutOfBorders () {
    let head = this.state.snakeDots.at(-1);
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0)
      return true;
    return false;
  }

  checkIfCollapsed(){
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if(head[0] === dot[0] && head[1] === dot[1])
        this.GameOver();
    })
  }

  checkIfEat () {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;

    if (head[0] === food[0] && head[1] === food[1]){
      this.setState({
        food: getRandomCoordinates()
      });
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake () {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots:newSnake
    });
  }

  increaseSpeed () {
    if (this.state.speed > 10)
      this.setState({
        speed: this.state.speed - 10
      });
  }
  
  GameOver () {
    this.setState({ ...this.defaultState, gameOver: true, previousScore: this.state.snakeDots.length - 3 });
    clearInterval(this.intervalHandle);

    fetch(api, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': 'anonymous',
        'score': this.state.snakeDots.length - 3
      })
    });

    fetch(api)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({highScore: json});
      })
      .catch(error => console.log(error));
  }

  render () {
    return (
      <div className = "Snake">
        <div className = "snake-game">
          <SnakeBody snakeDots = {this.state.snakeDots}/>
          <Food dot = {this.state.food}/>
        </div>

        <div className = "snake-score">
          <Score
            score = {this.state.snakeDots.length - 3}
            gameOver = {this.state.gameOver}
            previousScore = {this.state.previousScore}
            highScore = {this.state.highScore}
          />
        </div>
      </div>
    );  
  }
}
