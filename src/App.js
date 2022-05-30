import axios from "axios";
import { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [allTodos, setAllTodos] = useState([]);
  const [oneTodo, setOneTodo] = useState({});
  console.log("Onestate:", oneTodo);
  function effectAll() {
    async function getTodos() {
      const response = await axios.get("http://localhost:5000/todos");
      console.log("all", response.data);
      setAllTodos(response.data);
    }

    getTodos();
  }
  useEffect(effectAll, []);

  const sortedTodos = allTodos.sort((a, b) => {
    const diff = a.todo_id - b.todo_id;
    return diff;
  });
  const listItems = sortedTodos.map((eachTodo) => {
    const handleClick = async () => {
      setOneTodo(() => eachTodo);
      //          setOneTodo(eachTodo); could be done this way but doesn't allow multiple updates to be handled by react
      const updateResponse = await axios.patch(
        `http://localhost:5000/todos/${eachTodo.todo_id}/add-view`
      );
      console.log("Update:", updateResponse);
      const response = await axios.get(
        `http://localhost:5000/todos/${eachTodo.todo_id}`
      );
      console.log("one response:", response);
      setOneTodo(response.data);
    };
    const className=eachTodo.completed&&"completed"
    const listItem = (
      <li key={eachTodo.todo_id} onClick={handleClick} className={className}>
        {eachTodo.description} (#{eachTodo.todo_id})
      </li>
    );
    return listItem;
  });

  const handle = async function () {
    console.log(oneTodo);
    const url = `http://localhost:5000/todos/${oneTodo.todo_id}/toggle-completed`;
    const response = await axios.patch(url);
    console.log(response.data);
  };

  return (
    <>
      <p>count:{allTodos.length}</p>
      <ul>{listItems}</ul>
      <p>Selected Todo ID:{oneTodo.todo_id}</p>
      <p>Selected Todo description:{oneTodo.description}</p>
      <p>Views:{oneTodo.views}</p>
      <button onClick={handle}>Change complete status</button>
    </>
  );
}

export default App;
