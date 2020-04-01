export const getFamily = () => ({
  name: 'Bažantovi',
  getParents: () => ['Jana', 'Jirka'],
  getChild: () => {
    console.warn(
      'getChild is going to be deprecated since September 2020. Use getChildren instead.'
    );
    return 'Alice';
  },
  getChildren: () => ['Alice', 'NOT_DEFINED_YET'],
});
