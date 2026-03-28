export function toMatchPattern(userPattern: string): string {
  if (userPattern === "*") return "<all_urls>";
  return `*://${userPattern}`;
}

export function urlMatchesPattern(url: string, userPattern: string): boolean {
  if (userPattern === "*") return true;

  const urlWithoutProtocol = url.replace(/^.*?:\/\//, "");
  const regexStr = userPattern
    .replace(/[.?+[\](){ }^$|\\]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${regexStr}$`).test(urlWithoutProtocol);
}
