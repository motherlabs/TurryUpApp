import ImgToBase64 from 'react-native-image-base64';

export const convertBase64 = async ({
  uri,
  filename,
  type,
}: {
  uri: string;
  filename: string;
  type: string;
}) => {
  const base64: string = await ImgToBase64.getBase64String(uri);
  return {filename, type, data: base64};
};
