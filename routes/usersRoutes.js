const UsersController = require("../controllers/usersController");
const passport = require("passport");

module.exports = (app, upload) => {
  // TRAER DATOS
  app.get("/api/users/getAll", UsersController.getAll);
  app.get(
    "/api/users/findById/:id",
    passport.authenticate("jwt", { session: false }),
    UsersController.findById
  );
  app.get(
    "/api/users/findDeliveryMen",
    passport.authenticate("jwt", { session: false }),
    UsersController.findDelivery
  );
  // GUARDAR DATOS
  app.post(
    "/api/users/create",
    upload.array("image", 1),
    UsersController.registerWidthImage
  );
  app.post("/api/users/login", UsersController.login);
  app.post("/api/users/logout", UsersController.logout);

  //ACTUALIZAR DATOS
  app.put(
    "/api/users/update",
    upload.array("image", 1),
    passport.authenticate("jwt", { session: false }),
    UsersController.update
  );
};
