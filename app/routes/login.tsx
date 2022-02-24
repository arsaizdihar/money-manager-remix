import React from "react";
import { ActionFunction, Form, json, useSearchParams } from "remix";
import { createUserSession, login } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  const user = await login({ email, password });
  if (!user) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  return createUserSession(user.id, redirectTo);
};

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Form className="flex flex-col" method="post">
        <h1>Login</h1>
        <input type="email" name="email" placeholder="Email" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="password" name="password" autoComplete="password" />
        <button type="submit">Login</button>
      </Form>
    </div>
  );
};

export default Login;
