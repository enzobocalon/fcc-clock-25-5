function App() {
  
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60)
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [isTimerOn, setIsTimerOn] = React.useState(false);
    const [isBreak, setIsBreak] = React.useState(false);
    const [sound, setSound] = React.useState(null);
  
    function updateDisplayTime(time) {
      setDisplayTime(time);
    }
  
    React.useEffect(() => {
      if (isBreak) {
        updateDisplayTime(breakTime);
      }
    }, [breakTime]);
  
    React.useEffect(() => {
      if (!isBreak) {
        updateDisplayTime(sessionTime);
      }
    }, [sessionTime]);
  
    React.useEffect(() => {
      setSound(document.getElementById('beep'));
    }, []);
  
    const playSound = () => {
      var audio = sound;
      audio.id = 'beep';
      audio.src = 'https://assets.coderrocketfuel.com/pomodoro-times-up.mp3';
      audio.currentTime = 0;
      audio.play();
    }
  
    const formatTimeMin = (time) => {
      return Math.floor(time / 60);
    }
  
    const formatTime = (time) => {
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      return (
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
      );
    }
  
  
    const changeTime = (amountChanged, type) => {
      if (!isTimerOn) {
        if (type === "break") {
          if (breakTime <= 60 && amountChanged < 0) {
            return;
          }
          setBreakTime(prev => prev + amountChanged);
        } else if (type === "session") {
          if (sessionTime <= 60 && amountChanged < 0) {
            return;
          }
          setSessionTime(prev => prev + amountChanged);
        }
      }
    }
  
    const play = () => {

      let date = new Date().getTime();
      let nextDate = Math.round(new Date().getTime() + 1000);
      let isBreakOn = isBreak;
      if (!isTimerOn) {
        let interval = setInterval(() => {
          date = new Date().getTime();
          if (date > nextDate) {
            setDisplayTime(prev => {
              // displayTime == 0
              if (prev <= 0 && !isBreakOn) {
                playSound();
                isBreakOn = true;
                setIsBreak(true);
                return breakTime;
              // displayTime == 0
              } else if (prev <= 0 && isBreakOn) {
                playSound();
                isBreakOn = false;
                setIsBreak(false);
                return sessionTime;
              }
              return prev - 1;
            });
            nextDate += 1000;
          }
        }, 50)
        localStorage.clear();
        localStorage.setItem('interval-id', interval);
      } else {
        clearInterval(localStorage.getItem('interval-id'));
      }
      setIsTimerOn(prev => !prev);
    }
  
    const reset = () => {
      if (isTimerOn) {
        play();
      }
      sound.pause();
      sound.currentTime = 0;
      setBreakTime(5 * 60);
      setSessionTime(25 * 60);
      setDisplayTime(25 * 60);
      setIsBreak(false);
    }
  
    return (
        <>
      <div className="container">
        <audio id="beep"></audio>
        <div className='timer'>
        <Length
            title={"Break Length"}
            time={breakTime}
            type={'break'}
            changeTime={changeTime}
            formatTime={formatTimeMin}
          />
          <main>
                <h2 className={`label ${isBreak ? 'break' : 'session'}`} id="timer-label">{isBreak ? "Break" : "Session"}</h2>
                <h1 className="time" id="time-left">{formatTime(displayTime)}</h1>
                <div className='timer-control'>
                  <button id="start_stop" onClick={() => play()}>
                    {isTimerOn
                      ? (<i className="material-icons">pause_circle_filled</i>)
                      : (<i className="material-icons">play_circle_filled</i>)
                    }
                  </button>
                  <button id="reset" onClick={() => reset()}>
                    <i className="material-icons">autorenew</i>
                  </button>
                </div>
          </main>
            
          <Length
            title={"Session Length"}
            type={'session'}
            time={sessionTime}
            changeTime={changeTime}
            formatTime={formatTimeMin}
          />

        </div>

      </div>

      <footer>
        <span>Credits to <a href="https://www.youtube.com/watch?v=8khA0nJzh8A" target='__blank'>Landon Schlangen</a> || Adapted by <a href="https://github.com/enzobocalon" target="__blank">Enzo Bocalon</a></span>
      </footer>
      </>
    )
  }
  
  function Length({ title, changeTime, type, time, formatTime }) {
  
    return (
        <div className='vvb'>
            <h3>{title}</h3>
            <div className='time-sets'>
                <button id='decrease' onClick={() => changeTime(-60, type)}>
                    <i className="material-icons">arrow_drop_down</i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button id='increase' onClick={() => changeTime(+60, type)}>
                <i className="material-icons">arrow_drop_up</i>
                </button>
            </div>
        </div>
    )
  }
  
  // export component 'App' -> element 'root'
  ReactDOM.render(<App />, document.getElementById('root'))
  