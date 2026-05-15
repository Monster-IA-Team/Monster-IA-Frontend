import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("confirm", "routes/auth/confirm.tsx"),
  route("activate", "routes/auth/activate.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("set-new-password", "routes/auth/reset-password-confirm.tsx"),

  route("dashboard", "routes/user/dashboard.tsx"),
  route("list", "routes/user/list.tsx"),
  route("can-checker", "routes/user/predict.tsx"),
  route("planer", "routes/user/planer.tsx"),
  route("planners", "routes/user/planner-list.tsx"),
  route("planner/:plannerId", "routes/user/planer-details.tsx"),
  route("taste-quiz", "routes/user/taste-quiz.tsx"),

  route("admin", "routes/admin/admin.tsx", [
    index("routes/admin/dashboard.tsx"),
    route("users", "routes/admin/admin-users-list.tsx"),
  ]),
] satisfies RouteConfig;