export type PostAuthRoute = "/shop" | "/cart" | "/checkout" | "/track-order";

const postAuthRoutes: PostAuthRoute[] = [
  "/shop",
  "/cart",
  "/checkout",
  "/track-order",
];

export function getPostAuthRoute(
  value: string | string[] | undefined,
  fallback: PostAuthRoute = "/shop",
): PostAuthRoute {
  if (typeof value === "string") {
    const route = postAuthRoutes.find((candidate) => candidate === value);
    if (route) return route;
  }
  return fallback;
}
