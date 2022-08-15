import axios from "axios";
import './App.css';
import { useState } from 'react';
import { useCallback } from 'react';

function App() {
  // const [search,setSearch] = useState([])
  const [val, setVal] = useState("");
  const [userData, setUserData] = useState([]);

  const handleChangeInput = (e) => {
    setVal(e.target.value);
    // optimizedSearch(apiCallForSearch)()
    apiCallForSearch(e.target.value);
  };
  const optimizedSearch = (fun, duration = 1000) => {
    let timerId = null;
    return (...arg) => {
      clearInterval(timerId);
      timerId = setTimeout(() => {
        fun(...arg);
      }, duration);
    };
  };

  const apiCallForSearch = async (val) => {
    try {
      const { data } = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${val}`
      );
      setUserData(data?.hits, "res");
      console.log(data.hits, "res");
    } catch (error) {
      console.log(error, "error");
    }
  };

  // const debounce = (func) => {
  //   let timer;
  //   return function (...args){
  //     const context = this
  //     if(timer) clearTimeout(timer)
  //     timer = setTimeout(()=>{
  //       timer = null
  //       func.apply(context,args)
  //     },500)
  //   }
  // }
  // const handleChange = (event) =>{
  //   const {value} = event.target
  //   fetch(`https://hn.algolia.com/api/v1/search?query=${value}`)
  //   .then(res => res.json())
  //   .then(json => setSearch(json.hits))
  // }
  // const optimisedVersion = useCallback(debounce(handleChange),[])
  let search = useCallback(optimizedSearch(handleChangeInput), []);
  return (
    <div className="App">
      <input onChange={optimizedSearch(handleChangeInput)}/>
      {
        userData.length >0 && 
        <div>
          {userData.map((el,i)=>{
            return <div key={i}>{el.author}</div>
          })}
        </div>
      }
    </div>
  );
}

export default App;
