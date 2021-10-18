const roles = ['client', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers']);
roleRights.set(roles[1], ['getUsers', 'manageUsers']);

export { roles, roleRights };
