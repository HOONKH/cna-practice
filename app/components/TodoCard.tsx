import { Todo } from "@prisma/client";
import { FC } from "react";

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: FC<TodoCardProps> = ({ todo }) => {
  return (
    <li>
      <button className="w-60 text-left truncate">{todo.content}</button>
      <button className="btn-style ml-2">수정</button>
      <button className="btn-style ml-2">삭제</button>
    </li>
  );
};

export default TodoCard;
