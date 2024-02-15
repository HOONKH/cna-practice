"use client";

import { NextPage } from "next";
import CreateTodo from "./components/CreateTodo";
import axios from "axios";
import { useEffect, useState } from "react";
import { Todo } from "@prisma/client";
import TodoCard from "./components/TodoCard";
import Header from "./components/Header";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get<Todo[]>(
        `${process.env.NEXT_PUBLIC_URL}/api/todo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-blue-100 flex flex-col items-center py-2 gap-12">
      <Header />
      <CreateTodo todos={todos} setTodos={setTodos} />
      <ul className="flex flex-col gap-2">
        {todos.map((v, i) => (
          <TodoCard key={i} todo={v} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
