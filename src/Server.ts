import appInit from "./App";

appInit().then((app) => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Listening at http://localhost:${process.env.PORT}`
    );
  });
});
