"use client";

import { Todo } from "@prisma/client";
import axios from "axios";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";

interface CreateTodoProps {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const CreateTodo: FC<CreateTodoProps> = ({ todos, setTodos }) => {
  const [content, setContent] = useState<string>("");

  const onCreateTodo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // content 값 체크 + token
      const token = localStorage.getItem("token");

      if (!content || !token) return;
      // axios 요청 보냄
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/todo`,
        {
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // 잘 오는지 콘솔 로그 확인
      console.log(response);
      setContent("");
      setTodos([response.data, ...todos]);
      //기존 투두리스트에 추가
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form className="" onSubmit={onCreateTodo}>
      <input
        className="input-style"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input className="btn-style ml-2" type="submit" value="생성" />
    </form>
  );
};

export default CreateTodo;
