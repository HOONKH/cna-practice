import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();

//유저생성
export const POST = async (request: NextRequest) => {
  try {
    const { account, password } = await request.json(); //비동기로 꺼내옴

    console.log(account);
    console.log(password);

    if (!account || !password) {
      return NextResponse.json(
        {
          message: "Not exist data",
        },
        {
          status: 400,
        }
      );
    }

    const existUser = await client.user.findUnique({
      where: {
        account: account, //생략가능
      },
    });

    console.log(existUser);

    if (existUser) {
      return NextResponse.json(
        {
          message: "Already exist userID.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    //bcrypt.compare => 복구 기존에 비번과 비교해봄

    //hash (동기화일때),hashSycn (비동기화일때)
    //hash일때 앞에 await
    //saltOrRounds 10번정도 해싱

    //createMany는 배열로
    const newUser = await client.user.create({
      data: {
        account: account,
        password: hashedPassword,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        account: true,
        todos: true,
      },
    });

    //select는 가시성 부여 하지만 작성하지않으면 안나옴 include는 모두에게 가시성 부여 포함해서 가시성 부여

    console.log(newUser);

    return NextResponse.json(newUser);
    // id account
    // pw password db저장할때 무조건 암호화
    // 데이터베이스 저장 사용자에게 응답
    // 잘받았는지 확인 중복되는지 확인 확인이 안되면 에러
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
//try와 catch에 둘다 return이 있어야한다.
