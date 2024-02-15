// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { client } from "@/app/lib/prismaClient";

// const verifyToken = async (request: NextRequest) => {
//   const token = request.headers.get("Authorization");

//   if (!token) {
//     return NextResponse.json(
//       {
//         message: "Not exist data",
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   const verifiedToken = <jwt.UserJwtPayload>(
//     jwt.verify(token.substring(7), process.env.JWT_SECRET!)
//   );
// };

// if (!user) {
//   return NextResponse.json(
//     {
//       message: "Not exist data",
//     },
//     {
//       status: 400,
//     }
//   );
// }

// //투두 조회
// export const GET = async () => {
//   try {
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// };

// //투두 생성

// export const POST = async (request: NextRequest) => {
//   try {
//     // 토큰 확인 (검증)
//     // 1. 사용자로부터 토큰을 받기. 토큰은 헤더에서 받아옴  => Bearer
//     // 2. 그 토큰이 유효한지 검증.
//     const token = request.headers.get("Authorization");
//     const { content } = await request.json();
//     if (!token || !content) {
//       return NextResponse.json(
//         {
//           message: "Not exist data",
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//     //검증된것(토큰)을 쓰지않으면 바로 에러로 빠짐.

//     const verifiedToken = <jwt.UserJwtPayload>(
//       jwt.verify(token.substring(7), process.env.JWT_SECRET!)
//     );
//     // console.log(verifiedToken);
//     //account와 발행일자가 찍혀서 나옴
//     // 이 user가 어떤 투두를 생성할것인지
//     const user = await client.user.findUnique({
//       where: { account: verifiedToken.account },
//     });

//     if (!user) {
//       return NextResponse.json(
//         {
//           message: "이 도둑놈아!",
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//     // 투두를 생성
//     const todo = await client.todo.create({
//       data: {
//         content,
//         userId: user.id,
//       },
//     });

//     return NextResponse.json(todo);

//     // 응답
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// };

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { client } from "@/app/lib/prismaClient";

const verifyToken = async (request: NextRequest) => {
  const token = request.headers.get("Authorization");

  if (!token) {
    throw NextResponse.json(
      {
        message: "Not exist token.",
      },
      {
        status: 400,
      }
    );
  }

  const verifiedToken = <jwt.UserJwtPayload>(
    jwt.verify(token.substring(7), process.env.JWT_SECRET!)
  );

  const user = await client.user.findUnique({
    where: {
      account: verifiedToken.account,
    },
  });

  if (!user) {
    throw NextResponse.json(
      {
        message: "Not exist user.",
      },
      {
        status: 400,
      }
    );
  }

  return user;
};

// 투두 조회
export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyToken(request);

    const todos = await client.todo.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
        //asc 오름차순 (기본값) desc 내림차순
      },
    });

    console.log(todos);

    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);

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

// 투두 생성
export const POST = async (request: NextRequest) => {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        {
          message: "Not exist content.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await verifyToken(request);

    const todo = await client.todo.create({
      data: {
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error(error);

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
