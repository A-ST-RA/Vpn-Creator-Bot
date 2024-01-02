export const typographyReplacer = (text: string) => {
  return text.replace(/<p>/gm, '').replace(/<\/p>/gm, '\n');
}