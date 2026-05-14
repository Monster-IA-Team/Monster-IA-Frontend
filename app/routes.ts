import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("confirm", "routes/confirm.tsx"),
  route("activate", "routes/activate.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("can-checker", "routes/can-checker.tsx"),
  route("list", "routes/list.tsx"),
  route("planer", "routes/planer.tsx"),
] satisfies RouteConfig;
