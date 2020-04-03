export const getFamily = () => ({
  name: 'Bažantovi',
  getParents: () => ['Jana', 'Jirka'],
  getChild: () => {
    throw new Error('Removed since 4th October 2020');
  },
  getChildren: () => ['Alice', 'Ida'],
});
