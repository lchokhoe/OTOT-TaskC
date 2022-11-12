const ROLE = {
  ADMIN: "admin",
  BASIC: "basic",
};

module.exports = {
  ROLE: ROLE,
  users: [
    { id: 1, name: "Kyle", role: ROLE.ADMIN, password: "Kyle" },
    { id: 2, name: "Sally", role: ROLE.BASIC, password: "Sally" },
    { id: 3, name: "Joe", role: ROLE.BASIC, password: "Joe" },
  ],
  projects: [
    { id: 1, name: "Kyle's Project", userId: 1 },
    { id: 2, name: "Sally's Project", userId: 2 },
    { id: 3, name: "Joe's Project", userId: 3 },
  ],
};
