import { WebServer } from "./WebServer.mjs";
WebServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${WebServer.address().port}/`);
});
