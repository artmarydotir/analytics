/**
 * @ACL_Module      :MODULES_GENERAL
 * @ACL_Action      :MATH_OPERATION_PLUS
 * @ACL_Dimensions  :["lang"]
 */

module.exports = async (_, { x, y }, { container }) => {
  // console.log(_);
  // console.log(container.Config);
  // console.log({ x, y });

  return x + y;
};
