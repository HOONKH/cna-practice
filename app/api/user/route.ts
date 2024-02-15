import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "@/app/lib/prismaClient";
import { verifyToken } from "@/app/lib/verifyToken";

//유저 조회
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyToken(request);

    return NextResponse.json(user.account);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
};

//유저생성
export const POST = async (request: NextRequest) => {
  try {
    const { account, password } = await request.json(); //비동기로 꺼내옴 바디에서 받아옴. 바디에서 받아올때 await

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
    await client.user.create({
      data: {
        account: account,
        password: hashedPassword,
      },
    });

    // const token = jwt.sign({account:newUser.account}); 위의 뉴유져의 어카운트
    const token = jwt.sign({ account }, process.env.JWT_SECRET!);

    //토큰 검증
    //jwt.verify(token,process.env.JWT_SECRET!);

    //select는 가시성 부여 하지만 작성하지않으면 안나옴 include는 모두에게 가시성 부여 포함해서 가시성 부여

    // console.log(newUser); 54번 변수명이 있을때

    return NextResponse.json(token);
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
