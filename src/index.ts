import server from "./server";
import colors from "colors";

// Use PORT from environment variables or fall back to 4000
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(colors.cyan.bold(`REST API working in the port ${port}`));
});
