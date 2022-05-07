export default function handler(request, response) {
  const { name } = request.query;
  response.end(`Hello ${name}!`);
}