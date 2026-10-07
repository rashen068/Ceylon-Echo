export type TouristGuide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fileSize: string;
};

export const featuredGuide: TouristGuide = {
  id: 'sigiriya-fortress',
  title: 'Sigiriya Fortress',
  subtitle: 'Ancient Fortress & gardens',
  image:
    'https://upload.wikimedia.org/wikipedia/commons/e/e6/Sigiriya_%28141688197%29.jpeg?utm_source=ceylon-echo',
  fileSize: '18.4 MB',
};

export const touristGuides: TouristGuide[] = [
  featuredGuide,
  {
    id: 'temple-of-the-tooth',
    title: 'Temple of the Tooth Relic',
    subtitle: 'Sacred history in Kandy',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg/330px-SL_Kandy_asv2020-01_img33_Sacred_Tooth_Temple.jpg',
    fileSize: '14.2 MB',
  },
  {
    id: 'galle-dutch-fort',
    title: 'Galle Dutch Fort Tour',
    subtitle: 'Along the southern coast',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Galle_Fort.jpg/330px-Galle_Fort.jpg',
    fileSize: '22.1 MB',
  },
  {
    id: 'dambulla-cave-temple',
    title: 'Dambulla Cave Temple',
    subtitle: 'The Golden Temple',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/3/34/Dambulla-buddhastupa.jpg',
    fileSize: '11.5 MB',
  },
  {
    id: 'yala-national-park',
    title: 'Yala National Park Safari',
    subtitle: 'Wildlife and wilderness',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Yala_Beach.jpg/330px-Yala_Beach.jpg',
    fileSize: '19.8 MB',
  },
];
