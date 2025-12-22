/**
 * Script to document Figma image URLs for manual download
 * 
 * NOTE: The Figma localhost server (port 3845) must be running for these URLs to work.
 * These URLs are provided by Figma's Dev Mode and are temporary.
 * 
 * RECOMMENDED: Export images directly from Figma instead of using these URLs.
 */

const figmaAssets = {
  // Podcast Section
  podcasts: [
    {
      name: 'podcast-rectangle-27.png',
      url: 'http://localhost:3845/assets/62b25fa142f4a7619a401dcaacfdf799932979e6.png',
      description: 'Box Office VR Theatre Performance 1'
    },
    {
      name: 'podcast-rectangle-28.png',
      url: 'http://localhost:3845/assets/883cca65434591d59cb2cf44167d804aa8e50d6e.png',
      description: 'Box Office VR Theatre Performance 2'
    },
    {
      name: 'podcast-rectangle-29.png',
      url: 'http://localhost:3845/assets/d3ba0fd122dce645124ad68d50b734c56f68d431.png',
      description: 'Box Office VR Theatre Performance 3'
    }
  ],

  // Gallery/Team Photos
  gallery: [
    {
      name: 'gallery-img-7454.png',
      url: 'http://localhost:3845/assets/cb60bce3b1a897591450ea588e51bad28be09a5f.png'
    },
    {
      name: 'gallery-team-photo.png',
      url: 'http://localhost:3845/assets/12490dcddf45dce6e8cc5a7bc2dfb79aaa17ab70.png'
    },
    {
      name: 'gallery-microsoft-teams.png',
      url: 'http://localhost:3845/assets/b6d1f5a49c1cd2141f3ddca7a452091878444cb6.png'
    },
    {
      name: 'gallery-colour-digital.png',
      url: 'http://localhost:3845/assets/e91cd988c2334e5f2137520a78e2eb23d82e80af.png'
    },
    {
      name: 'gallery-office-photo.png',
      url: 'http://localhost:3845/assets/08f2319b3155dad74347dac3c2f3b385b7600234.png'
    },
    {
      name: 'gallery-paintball.png',
      url: 'http://localhost:3845/assets/c724c62ec0280ad13acbb7ff780f48f57b687439.png'
    },
    {
      name: 'gallery-team-img.png',
      url: 'http://localhost:3845/assets/38cbab405028c5545bb1a25bb942834ee7c624e5.png'
    },
    {
      name: 'gallery-meeting.png',
      url: 'http://localhost:3845/assets/d0584b95b328b5800d91caad9657cd4bd1636e78.png'
    },
    {
      name: 'gallery-ypac.png',
      url: 'http://localhost:3845/assets/225508159282d63d5daeb986c8d3b01ec57d160e.png'
    },
    {
      name: 'gallery-dsc-9490.png',
      url: 'http://localhost:3845/assets/9f67fcfd6119cb4eae1febe271d7f11f0d3aacc8.png'
    },
    {
      name: 'gallery-team-738a.png',
      url: 'http://localhost:3845/assets/50f9fc592813214b256b1328eb0cd5ec6789a6d6.png'
    },
    {
      name: 'gallery-microsoft-teams-4.png',
      url: 'http://localhost:3845/assets/fdae222aa38bfe49767a369f81e6e8da2e865db2.png'
    },
    {
      name: 'gallery-img-20230302.png',
      url: 'http://localhost:3845/assets/25d2d625a9cd263cc376a4af089e59a49ad7d204.png'
    },
    {
      name: 'gallery-dsc-9364.png',
      url: 'http://localhost:3845/assets/ea0ad1d7cb998ca40d6770ee1f2d24aa1251462f.png'
    },
    {
      name: 'gallery-microsoft-teams-5.png',
      url: 'http://localhost:3845/assets/8f79debc4582baa6df6d75afacd6ff069584f3a5.png'
    }
  ],

  // Logos and Icons (SVG)
  logos: [
    {
      name: 'logo-42i-landscape.svg',
      url: 'http://localhost:3845/assets/330654adc84006564e463ff3319eb1773cbb5c33.svg',
      description: 'Main 42 Interactive logo for header'
    }
  ],

  // Social Icons (SVG)
  social: [
    {
      name: 'social-icon-1.svg',
      url: 'http://localhost:3845/assets/09ab8b9ef56457fdee83d833170d00d475825483.svg'
    },
    {
      name: 'social-icon-2.svg',
      url: 'http://localhost:3845/assets/ca88452ae3f0ec7c479ec2553509a6c3b0a23e94.svg'
    },
    {
      name: 'social-icon-3.svg',
      url: 'http://localhost:3845/assets/17658337de0a318b0bbbbacd5dc0b38593c4a684.svg'
    }
  ],

  // Vector graphics and decorative elements
  vectors: [
    {
      name: 'vector-arrow-right.svg',
      url: 'http://localhost:3845/assets/5a120699df93ab693e6daf96fad0c4bcf93bb681.svg',
      description: 'Arrow icon for buttons'
    },
    {
      name: 'group-icon.svg',
      url: 'http://localhost:3845/assets/6a585c490861ce60dde1795211047f5c0a989f10.svg'
    }
  ]
};

console.log('='.repeat(60));
console.log('FIGMA ASSETS DOCUMENTATION');
console.log('='.repeat(60));
console.log('\nTo download these assets:');
console.log('1. Make sure Figma Dev Mode server is running (localhost:3845)');
console.log('2. Open each URL in a browser and save the file');
console.log('3. Save files to the images/ folder');
console.log('\nOR better yet:');
console.log('Export directly from Figma using the Export feature\n');
console.log('='.repeat(60));

// Print all assets
Object.keys(figmaAssets).forEach(category => {
  console.log(`\n${category.toUpperCase()}`);
  console.log('-'.repeat(60));
  figmaAssets[category].forEach(asset => {
    console.log(`\nFile: ${asset.name}`);
    console.log(`URL: ${asset.url}`);
    if (asset.description) {
      console.log(`Description: ${asset.description}`);
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`Total assets: ${
  Object.values(figmaAssets).reduce((sum, arr) => sum + arr.length, 0)
}`);
console.log('='.repeat(60));

module.exports = figmaAssets;

