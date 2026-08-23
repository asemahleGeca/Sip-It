export type Product = {
  id: string;
  name: string;
  price: number;
  image: any; // require(...) for local images, or { uri: string } for remote
};

// NOTE: filenames below match what's currently in assets/images/ exactly,
// including capitalization (Windows ignores case, but Metro's bundler
// can be case-sensitive, so these must match precisely).
export const productsByCategory: Record<string, Product[]> = {
  Cognac: [
    { id: 'c1', name: 'Hennessy', price: 500, image: require('../assets/images/hennessy vs.png') },
    { id: 'c2', name: 'Honor', price: 500, image: require('../assets/images/honor.png') },
  ],
  Ciders: [
    { id: 'ci1', name: 'Savannah', price: 160, image: require('../assets/images/savanna-dry.png') },
    { id: 'ci2', name: 'Brutal Fruit', price: 160, image: require('../assets/images/brutal.png') },
    { id: 'ci3', name: 'Bernini', price: 160, image: require('../assets/images/bernini.png') },
    { id: 'ci4', name: 'Chillers Punch', price: 160, image: require('../assets/images/chillers_punch.png') },
    { id: 'ci5', name: 'MXD', price: 160, image: require('../assets/images/MXD.png') },
  ],
  Spirits: [
    { id: 's1', name: 'SKYY Vodka', price: 190, image: require('../assets/images/skyy_vodka.png') },
    { id: 's2', name: 'Smirnoff', price: 190, image: require('../assets/images/Smirnoff_1818_Vodka_750ml.png') },
  ],
  Gin: [
    { id: 'g1', name: "Gordon's", price: 220, image: require('../assets/images/Gordons_Gin.png') },
    { id: 'g2', name: 'Belgravia', price: 220, image: require('../assets/images/Belgravia.png') },
  ],
  Wine: [
    { id: 'w1', name: 'Saint Anna', price: 90, image: require('../assets/images/saint_anna.png') },
  ],
  Rum: [],
};