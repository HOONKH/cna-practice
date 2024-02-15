import axios from "axios";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

const Header: FC = () => {
  const [account, setAccount] = useState<string>("");

  const getMe = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;
      // axios 요청 보냄
      const response = await axios.get<string>(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccount(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <header className="flex items-center ">
      {account && <div className="mr-4">{account}님</div>}
      <div className="flex gap-2">
        <Link href="/sign-in" className="btn-style">
          로그인
        </Link>

        <Link href="/sign-up" className="btn-style">
          로그아웃
        </Link>
      </div>
    </header>
  );
};

export default Header;
