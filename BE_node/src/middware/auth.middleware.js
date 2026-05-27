import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const getTokenFromCookies = (cookieHeader) => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const jwtCookie = cookies.find((cookie) => cookie.startsWith("jwt="));

  return jwtCookie ? decodeURIComponent(jwtCookie.split("=")[1]) : null;
};

const getTokenFromRequest = (request) => {
  const authHeader = request.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return getTokenFromCookies(request.headers.cookie);
};

export const protectRoute = async (request, response, next) => {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return response.status(401).json({ message: "Not authorized" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return response.status(401).json({ message: "Not authorized" });
    }

    request.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return response.status(401).json({ message: "Not authorized" });
    }

    next(error);
  }
};
