import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { client } from "./prismaClient";

export const verifyToken = async (request: NextRequest) => {
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
