"use client";

import axios from "axios";
import { NextPage } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const SignIn: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const onSignIn = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!account || !password) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/auth`,
        {
          account,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data);
        // 토큰을 저장합니다.
        router.replace("/");
        // 메인페이지로 보냅니다.
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container  flex flex-col justify-center items-center">
      <h1 className="text-xl font-semibold">To do list - Sign In</h1>
      <form onSubmit={onSignIn} className="mt-4 flex">
        <div className="flex flex-col gap-2">
          {/* <label>ID</label> */}
          <input
            className="input-style"
            type="text"
            placeholder="ID"
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            className="input-style"
            type="password"
            placeholder="PW"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          className="self-center ml-2 btn-style font-semibold py-6"
          type="submit"
          value="Sign In"
        />
      </form>
    </div>
  );
};

export default SignIn;
