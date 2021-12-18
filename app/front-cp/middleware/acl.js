// role-based access control
export default function ({ store, redirect, route, error }) {
  const permissions = [].concat(
    ...route.matched.map((r) => {
      return r.components.default.options
        ? r.components.default.options.permissions
        : r.components.default.permissions;
    }),
  );

  const currentRole = store.getters['user/auth/GET_ROLE'];

  if (permissions.length > 0) {
    if (!permissions.includes(currentRole)) {
      return error({
        message: 'You are not authorized to view this page.',
        statusCode: 403,
      });
    }
  }
}
