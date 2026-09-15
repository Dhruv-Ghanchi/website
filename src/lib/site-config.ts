import { images } from './content';

export const siteConfig = {
  name: 'Kora',
  hero: {
    mode: 'image' as 'image' | 'video',
    image: images.hero,
    video: '',
    overlayOpacity: 0.4,
  },
  processVideo: '',
};
